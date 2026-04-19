import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  ECIGARETTE_USAGE_OPTIONS,
  GENERAL_HEALTH_OPTIONS,
  PREDICTION_TRISTATE_OPTIONS,
  SMOKER_STATUS_OPTIONS
} from '../../../../core/constants/data/prediction-survey-options.constant';
import { PREDICTION_SIMULATION_MESSAGES } from '../../../../core/constants/messages/prediction-simulation-messages.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import { PREDICTION_SIMULATION_UI } from '../../../../core/constants/ui/prediction-simulation-ui.constant';
import { PREDICTION_RESULT_UI } from '../../../../core/constants/ui/prediction-ui.constant';
import {
  PredictionSimulationNormalizedState,
  PredictionSimulationViewModel
} from '../../../../core/models/prediction-simulation.model';
import { PredictionResultData } from '../../../../core/models/prediction-response.model';
import { PredictionService } from '../../../../core/services/prediction.service';
import { predictionRiskPillKind } from '../../../../core/utils/prediction-risk-display.util';
import {
  boolToSurveyTriState,
  buildSimulationRequestBody,
  listSimulationFieldChanges,
  mergeSimulationViewModel,
  normalizedStateFromDetailResult,
  normalizedStateFromSimulationForm,
  SimulationFormRawValue
} from '../../../../core/utils/prediction-simulation-state.util';
import { formatAuthHttpError } from '../../../auth/utils/http-error.util';
import { PredictionFormBuilderService } from '../../../prediction/services/prediction-form-builder.service';
import { PredictionRiskPillKind } from '../../../../core/constants/prediction-result-risk.constant';

@Component({
  selector: 'app-prediction-what-if-panel',
  templateUrl: './prediction-what-if-panel.component.html',
  styleUrl: './prediction-what-if-panel.component.scss'
})
export class PredictionWhatIfPanelComponent implements OnChanges {
  private readonly predictionApi = inject(PredictionService);
  private readonly forms = inject(PredictionFormBuilderService);

  @Input({ required: true }) predictionId!: string;
  @Input({ required: true }) baselineResult!: PredictionResultData;

  readonly ui = PREDICTION_SIMULATION_UI;
  readonly resultUi = PREDICTION_RESULT_UI;
  readonly messages = PREDICTION_SIMULATION_MESSAGES;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly generalHealthOptions = GENERAL_HEALTH_OPTIONS;
  readonly smokerStatusOptions = SMOKER_STATUS_OPTIONS;
  readonly ecigaretteOptions = ECIGARETTE_USAGE_OPTIONS;
  readonly triStateOptions = PREDICTION_TRISTATE_OPTIONS;

  readonly form: FormGroup = this.forms.createSimulationForm();

  submitting = false;
  simError: string | null = null;
  simulationView: PredictionSimulationViewModel | null = null;

  private baselineNorm!: PredictionSimulationNormalizedState;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baselineResult'] && this.baselineResult) {
      this.patchFromBaseline(this.baselineResult);
      this.simulationView = null;
      this.simError = null;
    }
  }

  riskPillKind(level: string | null | undefined): PredictionRiskPillKind {
    return predictionRiskPillKind(level);
  }

  labelForChangedField(key: string): string {
    const map = this.ui.fieldKeys as Record<string, string>;
    return map[key] ?? key;
  }

  resetToBaseline(): void {
    this.patchFromBaseline(this.baselineResult);
    this.simulationView = null;
    this.simError = null;
  }

  hideSimulationOutput(): void {
    this.simulationView = null;
    this.simError = null;
  }

  submitSimulation(): void {
    this.simError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue() as SimulationFormRawValue;
    const next = normalizedStateFromSimulationForm(raw);
    const body = buildSimulationRequestBody(this.baselineNorm, next);
    if (Object.keys(body).length === 0) {
      this.simError = this.messages.noChanges;
      return;
    }
    const clientChangedKeys = listSimulationFieldChanges(this.baselineNorm, next);
    this.submitting = true;
    this.predictionApi
      .simulateAuthenticatedPrediction(this.predictionId, body, this.baselineResult)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (parsed) => {
          this.simulationView = mergeSimulationViewModel({
            simulated: parsed.simulated,
            baselineResult: this.baselineResult,
            clientChangedKeys,
            serverOriginalProbability: parsed.serverOriginalProbability,
            serverOriginalRiskLevel: parsed.serverOriginalRiskLevel,
            serverChangedFields: parsed.serverChangedFields,
            serverProbabilityDifference: parsed.serverProbabilityDifference
          });
        },
        error: (err: unknown) => {
          this.simulationView = null;
          if (err instanceof Error && err.message === 'SIMULATE_RESPONSE_PARSE') {
            this.simError = this.messages.invalidResponse;
          } else {
            this.simError = formatAuthHttpError(err);
          }
        }
      });
  }

  private patchFromBaseline(r: PredictionResultData): void {
    this.baselineNorm = normalizedStateFromDetailResult(r);
    this.form.patchValue({
      weight_kilograms: r.weight_kilograms,
      general_health: r.general_health ?? '',
      physical_health_days: r.physical_health_days ?? null,
      mental_health_days: r.mental_health_days ?? null,
      physical_activities: boolToSurveyTriState(r.physical_activities),
      sleep_hours: r.sleep_hours ?? null,
      smoker_status: r.smoker_status ?? '',
      ecigarette_usage: r.ecigarette_usage ?? '',
      alcohol_drinkers: boolToSurveyTriState(r.alcohol_drinkers)
    });
  }
}
