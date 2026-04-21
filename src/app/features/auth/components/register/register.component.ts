import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  REGISTER_DIABETES_OPTION_ITEMS,
  REGISTER_REMOVED_TEETH_OPTIONS,
  REGISTER_SEX_OPTIONS
} from '../../../../core/constants/data/register-api-options.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { REGISTER_PAGE_UI } from '../../../../core/constants/ui/auth-register-ui.constant';
import { BIRTH_DATE_FIELD_UI } from '../../../../core/constants/ui/birth-date-field-ui.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import { birthDateNotInFutureValidator } from '../../../../core/validators/birth-date-not-in-future.validator';
import {
  RegisterMedicalIn,
  RegisterProfileIn,
  RegisterRequestBody
} from '../../../../core/models/register-request.model';
import { AuthService } from '../../../../core/services/auth.service';
import { formatAuthHttpError } from '../../utils/http-error.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly pageUi = REGISTER_PAGE_UI;
  readonly limits = VALIDATION_LIMITS;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly removedTeethOptions = REGISTER_REMOVED_TEETH_OPTIONS;
  readonly diabetesOptions = REGISTER_DIABETES_OPTION_ITEMS;
  readonly sexOptions = REGISTER_SEX_OPTIONS;
  readonly birthDateFieldUi = BIRTH_DATE_FIELD_UI;

  get maxBirthDate(): Date {
    return new Date();
  }

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(this.limits.passwordMinRegister), Validators.maxLength(this.limits.passwordMax)]
    ],
    profile: this.fb.group({
      sex: ['' as RegisterProfileIn['sex'] | '', [Validators.required]],
      birth_date: [null as Date | null, [Validators.required, birthDateNotInFutureValidator()]],
      height_meters: [
        null as number | null,
        [Validators.required, Validators.min(this.limits.heightMetersMin), Validators.max(this.limits.heightMetersMax)]
      ],
      removed_teeth: ['' as RegisterProfileIn['removed_teeth'] | '', [Validators.required]]
    }),
    medical_conditions: this.fb.group({
      had_angina: this.fb.nonNullable.control(false),
      had_stroke: this.fb.nonNullable.control(false),
      had_asthma: this.fb.nonNullable.control(false),
      had_copd: this.fb.nonNullable.control(false),
      had_skin_cancer: this.fb.nonNullable.control(false),
      had_depressive_disorder: this.fb.nonNullable.control(false),
      had_kidney_disease: this.fb.nonNullable.control(false),
      had_arthritis: this.fb.nonNullable.control(false),
      had_diabetes: ['' as RegisterMedicalIn['had_diabetes'] | '', [Validators.required]],
      deaf_or_hard_of_hearing: this.fb.nonNullable.control(false),
      blind_or_vision_difficulty: this.fb.nonNullable.control(false),
      difficulty_concentrating: this.fb.nonNullable.control(false),
      difficulty_walking: this.fb.nonNullable.control(false),
      difficulty_dressing_bathing: this.fb.nonNullable.control(false),
      difficulty_errands: this.fb.nonNullable.control(false)
    })
  });

  submitting = false;
  serverError: string | null = null;

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body = this.buildRequestBody();
    this.submitting = true;
    this.auth
      .register(body)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigateByUrl(APP_ROUTE_URLS.predictionsAnonymous),
        error: (err) => {
          this.serverError = formatAuthHttpError(err);
        }
      });
  }

  private buildRequestBody(): RegisterRequestBody {
    const v = this.form.getRawValue();
    const p = v.profile;
    const m = v.medical_conditions;
    const birth = p.birth_date;
    const birthIso =
      birth instanceof Date && !Number.isNaN(birth.getTime()) ? formatDate(birth, 'yyyy-MM-dd', 'es') : '';
    return {
      email: (v.email ?? '').trim(),
      password: v.password as string,
      profile: {
        sex: p.sex as RegisterProfileIn['sex'],
        birth_date: birthIso as RegisterProfileIn['birth_date'],
        height_meters: Number(p.height_meters),
        removed_teeth: p.removed_teeth as RegisterProfileIn['removed_teeth']
      },
      medical_conditions: {
        had_angina: m.had_angina,
        had_stroke: m.had_stroke,
        had_asthma: m.had_asthma,
        had_copd: m.had_copd,
        had_skin_cancer: m.had_skin_cancer,
        had_depressive_disorder: m.had_depressive_disorder,
        had_kidney_disease: m.had_kidney_disease,
        had_arthritis: m.had_arthritis,
        had_diabetes: m.had_diabetes as RegisterMedicalIn['had_diabetes'],
        deaf_or_hard_of_hearing: m.deaf_or_hard_of_hearing,
        blind_or_vision_difficulty: m.blind_or_vision_difficulty,
        difficulty_concentrating: m.difficulty_concentrating,
        difficulty_walking: m.difficulty_walking,
        difficulty_dressing_bathing: m.difficulty_dressing_bathing,
        difficulty_errands: m.difficulty_errands
      }
    };
  }
}
