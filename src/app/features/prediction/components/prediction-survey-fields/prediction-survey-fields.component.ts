import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  COVID_POS_OPTIONS,
  ECIGARETTE_USAGE_OPTIONS,
  GENERAL_HEALTH_OPTIONS,
  LAST_CHECKUP_OPTIONS,
  PREDICTION_TRISTATE_OPTIONS,
  SMOKER_STATUS_OPTIONS,
  TETANUS_OPTIONS
} from '../../../../core/constants/data/prediction-survey-options.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';

@Component({
  selector: 'app-prediction-survey-fields',
  templateUrl: './prediction-survey-fields.component.html',
  styleUrl: './prediction-survey-fields.component.scss'
})
export class PredictionSurveyFieldsComponent {
  @Input({ required: true }) group!: FormGroup;

  /** Identificador del control (inputs nativos y `for` del `<label>`). */
  controlHtmlId(controlName: string): string {
    return `pred-survey-${controlName}`;
  }

  /** Identificador de la pregunta visible (lectores de pantalla vía `aria-labelledby` en `mat-select`). */
  fieldQuestionId(controlName: string): string {
    return `pred-survey-${controlName}-q`;
  }

  readonly validationMessages = VALIDATION_MESSAGES;
  readonly generalHealthOptions = GENERAL_HEALTH_OPTIONS;
  readonly lastCheckupOptions = LAST_CHECKUP_OPTIONS;
  readonly smokerStatusOptions = SMOKER_STATUS_OPTIONS;
  readonly ecigaretteOptions = ECIGARETTE_USAGE_OPTIONS;
  readonly tetanusOptions = TETANUS_OPTIONS;
  readonly covidOptions = COVID_POS_OPTIONS;
  readonly triStateOptions = PREDICTION_TRISTATE_OPTIONS;
}
