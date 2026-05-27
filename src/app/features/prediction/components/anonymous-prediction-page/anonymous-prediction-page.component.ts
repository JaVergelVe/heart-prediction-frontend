import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  PREDICTION_HAD_DIABETES_OPTIONS,
  PREDICTION_REMOVED_TEETH_OPTIONS,
  PREDICTION_SEX_OPTIONS
} from '../../../../core/constants/data/prediction-survey-options.constant';
import { PREDICTION_ROUTER_STATE_KEYS } from '../../../../core/constants/prediction-router-state.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import {
  PREDICTION_FLOW_KIND,
} from '../../../../core/constants/ui/prediction-ui.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import { RegisterMedicalIn, RegisterProfileIn } from '../../../../core/models/register-request.model';
import { PredictionService } from '../../../../core/services/prediction.service';
import { formatAuthHttpError } from '../../../auth/utils/http-error.util';
import { AnonymousPredictionSessionService } from '../../services/anonymous-prediction-session.service';
import { PredictionFormBuilderService } from '../../services/prediction-form-builder.service';
import { buildAnonymousPredictionRequest, SurveyFormValue } from '../../utils/prediction-payload.util';

@Component({
  selector: 'app-anonymous-prediction-page',
  templateUrl: './anonymous-prediction-page.component.html',
  styleUrl: './anonymous-prediction-page.component.scss'
})
export class AnonymousPredictionPageComponent {
  private readonly router = inject(Router);
  private readonly predictionApi = inject(PredictionService);
  private readonly session = inject(AnonymousPredictionSessionService);
  private readonly forms = inject(PredictionFormBuilderService);

  readonly limits = VALIDATION_LIMITS;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly sexOptions = PREDICTION_SEX_OPTIONS;
  readonly removedTeethOptions = PREDICTION_REMOVED_TEETH_OPTIONS;
  readonly diabetesOptionsAll = PREDICTION_HAD_DIABETES_OPTIONS;

  get maxBirthDate(): Date {
    return new Date();
  }

  readonly form: FormGroup = this.forms.createAnonymousForm();
  readonly surveyForm = this.form.get('survey') as FormGroup;
  readonly profileForm = this.form.get('profile') as FormGroup;
  readonly medicalForm = this.form.get('medical_conditions') as FormGroup;

  submitting = false;
  serverError: string | null = null;

  constructor() {
    this.profileForm
      .get('sex')!
      .valueChanges.pipe(takeUntilDestroyed())
      .subscribe((sex) => {
        this.enforceDiabetesOptionBySex(sex ?? '');
      });
  }

  get diabetesOptions(): readonly (typeof PREDICTION_HAD_DIABETES_OPTIONS)[number][] {
    const sex = this.profileForm.get('sex')?.value;
    if (sex === 'Male') {
      return this.diabetesOptionsAll.filter((opt) => opt.value !== 'Yes, but only during pregnancy (female)');
    }
    return this.diabetesOptionsAll;
  }

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue() as {
      profile: {
        sex: RegisterProfileIn['sex'];
        birth_date: Date;
        height_meters: number;
        removed_teeth: RegisterProfileIn['removed_teeth'];
      };
      medical_conditions: RegisterMedicalIn;
      survey: SurveyFormValue;
      weight_kilograms: number;
    };
    const birth = raw.profile.birth_date;
    const birthIso =
      birth instanceof Date && !Number.isNaN(birth.getTime())
        ? formatDate(birth, 'yyyy-MM-dd', 'es')
        : '';
    const sessionId = this.session.getOrCreateSessionId();
    const body = buildAnonymousPredictionRequest(
      sessionId,
      {
        sex: raw.profile.sex,
        birth_date: birthIso as RegisterProfileIn['birth_date'],
        height_meters: Number(raw.profile.height_meters),
        removed_teeth: raw.profile.removed_teeth
      },
      raw.medical_conditions,
      Number(raw.weight_kilograms),
      raw.survey
    );
    this.submitting = true;
    this.predictionApi
      .predictAnonymous(body)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (data) =>
          void this.router.navigateByUrl(APP_ROUTE_URLS.predictionsAnonymousResult, {
            state: {
              [PREDICTION_ROUTER_STATE_KEYS.flowKind]: PREDICTION_FLOW_KIND.anonymous,
              [PREDICTION_ROUTER_STATE_KEYS.result]: data
            }
          }),
        error: (err: unknown) => {
          this.serverError = formatAuthHttpError(err);
        }
      });
  }

  private enforceDiabetesOptionBySex(sex: RegisterProfileIn['sex'] | ''): void {
    if (sex !== 'Male') {
      return;
    }
    const diabetesControl = this.medicalForm.get('had_diabetes');
    if (diabetesControl?.value === 'Yes, but only during pregnancy (female)') {
      diabetesControl.setValue('No');
      diabetesControl.markAsDirty();
    }
  }
}
