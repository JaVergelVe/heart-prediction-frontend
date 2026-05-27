import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PREDICTION_ROUTER_STATE_KEYS } from '../../../../core/constants/prediction-router-state.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import {
  PREDICTION_FLOW_KIND,
} from '../../../../core/constants/ui/prediction-ui.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import { PredictionService } from '../../../../core/services/prediction.service';
import { formatAuthHttpError } from '../../../auth/utils/http-error.util';
import { isUnauthorizedHttpError } from '../../../../core/utils/http-unauthorized-status.util';
import { PredictionFormBuilderService } from '../../services/prediction-form-builder.service';
import { buildAuthenticatedPredictionRequest, SurveyFormValue } from '../../utils/prediction-payload.util';

@Component({
  selector: 'app-authenticated-prediction-page',
  templateUrl: './authenticated-prediction-page.component.html',
  styleUrl: './authenticated-prediction-page.component.scss'
})
export class AuthenticatedPredictionPageComponent {
  private readonly router = inject(Router);
  private readonly predictionApi = inject(PredictionService);
  private readonly forms = inject(PredictionFormBuilderService);

  readonly limits = VALIDATION_LIMITS;
  readonly validationMessages = VALIDATION_MESSAGES;

  readonly form: FormGroup = this.forms.createAuthenticatedForm();
  readonly surveyForm = this.form.get('survey') as FormGroup;

  submitting = false;
  serverError: string | null = null;

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue() as { survey: SurveyFormValue; weight_kilograms: number };
    const body = buildAuthenticatedPredictionRequest(Number(raw.weight_kilograms), raw.survey);
    this.submitting = true;
    this.predictionApi
      .predictAuthenticated(body)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (data) =>
          void this.router.navigateByUrl(APP_ROUTE_URLS.predictionsAuthenticatedResult, {
            state: {
              [PREDICTION_ROUTER_STATE_KEYS.flowKind]: PREDICTION_FLOW_KIND.authenticated,
              [PREDICTION_ROUTER_STATE_KEYS.result]: data
            }
          }),
        error: (err: unknown) => {
          if (isUnauthorizedHttpError(err)) {
            return;
          }
          this.serverError = formatAuthHttpError(err);
        }
      });
  }
}
