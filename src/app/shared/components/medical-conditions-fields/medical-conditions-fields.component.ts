import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MEDICAL_CLINICAL_PILLS,
  MEDICAL_CONDITIONS_FIELDS_UI,
  MEDICAL_FUNCTIONAL_PILLS
} from '../../../core/constants/ui/medical-conditions-fields-ui.constant';
import { RegisterMedicalIn } from '../../../core/models/register-request.model';
import { VALIDATION_MESSAGES } from '../../../core/constants/messages/validation-messages.constant';

export type MedicalDiabetesOption = {
  readonly value: RegisterMedicalIn['had_diabetes'];
  readonly label: string;
};

@Component({
  selector: 'app-medical-conditions-fields',
  templateUrl: './medical-conditions-fields.component.html',
  styleUrl: './medical-conditions-fields.component.scss'
})
export class MedicalConditionsFieldsComponent {
  readonly ui = MEDICAL_CONDITIONS_FIELDS_UI;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly clinicalPills = MEDICAL_CLINICAL_PILLS;
  readonly functionalPills = MEDICAL_FUNCTIONAL_PILLS;

  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) diabetesOptions!: readonly MedicalDiabetesOption[];
  @Input() showIntroHint = false;
}
