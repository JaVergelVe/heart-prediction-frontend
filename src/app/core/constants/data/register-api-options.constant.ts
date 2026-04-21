import {
  RegisterMedicalIn,
  RegisterProfileIn
} from '../../models/register-request.model';

/** Opciones enviadas al API (literales del contrato backend). */
export const REGISTER_REMOVED_TEETH_OPTIONS: readonly RegisterProfileIn['removed_teeth'][] = [
  'None of them',
  '1 to 5',
  '6 or more, but not all',
  'All'
];

export const REGISTER_DIABETES_OPTIONS: readonly RegisterMedicalIn['had_diabetes'][] = [
  'No',
  'Yes',
  'No, pre-diabetes or borderline diabetes',
  'Yes, but only during pregnancy (female)'
];

export const REGISTER_DIABETES_OPTION_ITEMS: readonly {
  readonly value: RegisterMedicalIn['had_diabetes'];
  readonly label: string;
}[] = [
  { value: 'No', label: 'No' },
  { value: 'Yes', label: 'Sí' },
  { value: 'No, pre-diabetes or borderline diabetes', label: 'No, prediabetes o diabetes limítrofe' },
  { value: 'Yes, but only during pregnancy (female)', label: 'Sí, pero solo durante el embarazo (mujer)' }
];

export const REGISTER_SEX_OPTIONS: readonly {
  readonly value: RegisterProfileIn['sex'];
  readonly label: string;
}[] = [
  { value: 'Male', label: 'Masculino' },
  { value: 'Female', label: 'Femenino' }
];
