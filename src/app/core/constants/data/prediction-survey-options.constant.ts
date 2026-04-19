import {
  CovidPos,
  EcigaretteUsage,
  GeneralHealth,
  LastCheckupTime,
  SmokerStatus,
  TetanusLast10Tdap
} from '../../models/prediction-api.model';
import { RegisterMedicalIn, RegisterProfileIn } from '../../models/register-request.model';

export type LabeledOption<T extends string> = { readonly value: T; readonly label: string };

/** Valores auxiliares del formulario para sí/no opcional (se mapean a boolean | null). */
export const PREDICTION_TRISTATE_FORM = {
  unset: '',
  yes: 'yes',
  no: 'no'
} as const;

export type PredictionTristateFormValue =
  (typeof PREDICTION_TRISTATE_FORM)[keyof typeof PREDICTION_TRISTATE_FORM];

export const PREDICTION_SEX_OPTIONS: readonly LabeledOption<RegisterProfileIn['sex']>[] = [
  { value: 'Male', label: 'Masculino' },
  { value: 'Female', label: 'Femenino' }
] as const;

/** Dientes extraídos: valores literales del API, etiquetas en español (formularios de predicción). */
export const PREDICTION_REMOVED_TEETH_OPTIONS: readonly LabeledOption<RegisterProfileIn['removed_teeth']>[] = [
  { value: 'None of them', label: 'Ninguno' },
  { value: '1 to 5', label: 'De 1 a 5' },
  { value: '6 or more, but not all', label: '6 o más, pero no todos' },
  { value: 'All', label: 'Todos' }
] as const;

/** Diabetes: valores literales del API, etiquetas en español (formularios de predicción). */
export const PREDICTION_HAD_DIABETES_OPTIONS: readonly LabeledOption<RegisterMedicalIn['had_diabetes']>[] = [
  { value: 'No', label: 'No' },
  { value: 'Yes', label: 'Sí' },
  {
    value: 'No, pre-diabetes or borderline diabetes',
    label: 'No, pre-diabetes o diabetes en el límite'
  },
  {
    value: 'Yes, but only during pregnancy (female)',
    label: 'Sí, solo durante el embarazo (mujer)'
  }
] as const;

export const PREDICTION_TRISTATE_OPTIONS: readonly {
  readonly value: PredictionTristateFormValue;
  readonly label: string;
}[] = [
  { value: PREDICTION_TRISTATE_FORM.unset, label: 'Sin especificar' },
  { value: PREDICTION_TRISTATE_FORM.yes, label: 'Sí' },
  { value: PREDICTION_TRISTATE_FORM.no, label: 'No' }
] as const;

export const GENERAL_HEALTH_OPTIONS: readonly LabeledOption<GeneralHealth>[] = [
  { value: 'Excellent', label: 'Excelente' },
  { value: 'Very good', label: 'Muy buena' },
  { value: 'Good', label: 'Buena' },
  { value: 'Fair', label: 'Regular' },
  { value: 'Poor', label: 'Mala' }
] as const;

export const LAST_CHECKUP_OPTIONS: readonly LabeledOption<LastCheckupTime>[] = [
  {
    value: 'Within past year (anytime less than 12 months ago)',
    label: 'En el último año (menos de 12 meses)'
  },
  {
    value: 'Within past 2 years (1 year but less than 2 years ago)',
    label: 'Entre 1 y 2 años'
  },
  {
    value: 'Within past 5 years (2 years but less than 5 years ago)',
    label: 'Entre 2 y 5 años'
  },
  { value: '5 or more years ago', label: 'Hace 5 años o más' },
  { value: 'Never', label: 'Nunca' }
] as const;

export const SMOKER_STATUS_OPTIONS: readonly LabeledOption<SmokerStatus>[] = [
  { value: 'Never smoked', label: 'Nunca fumó' },
  { value: 'Former smoker', label: 'Exfumador' },
  { value: 'Current smoker - now smokes some days', label: 'Fumador actual: algunos días' },
  { value: 'Current smoker - now smokes every day', label: 'Fumador actual: todos los días' }
] as const;

export const ECIGARETTE_USAGE_OPTIONS: readonly LabeledOption<EcigaretteUsage>[] = [
  { value: 'Never used e-cigarettes in my entire life', label: 'Nunca ha usado cigarrillos electrónicos' },
  { value: 'Not at all (right now)', label: 'Ahora mismo: no usa' },
  { value: 'Use them some days', label: 'Algunos días' },
  { value: 'Use them every day', label: 'Todos los días' }
] as const;

export const TETANUS_OPTIONS: readonly LabeledOption<TetanusLast10Tdap>[] = [
  { value: 'Yes, received Tdap', label: 'Sí, recibió Tdap' },
  {
    value: 'Yes, received tetanus shot but not sure what type',
    label: 'Sí, vacuna antitetánica (tipo no seguro)'
  },
  {
    value: 'Yes, received tetanus shot, but not Tdap',
    label: 'Sí, antitetánica pero no Tdap'
  },
  {
    value: 'No, did not receive any tetanus shot in the past 10 years',
    label: 'No, ninguna en los últimos 10 años'
  }
] as const;

export const COVID_POS_OPTIONS: readonly LabeledOption<CovidPos>[] = [
  { value: 'Yes', label: 'Sí' },
  { value: 'No', label: 'No' },
  {
    value: 'Tested positive using home test without a health professional',
    label: 'Positivo en autotest en casa (sin profesional)'
  }
] as const;
