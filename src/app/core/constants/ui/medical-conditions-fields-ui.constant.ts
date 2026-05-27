import { RegisterMedicalIn } from '../../models/register-request.model';

/** Textos del bloque compartido de condiciones médicas. */
export const MEDICAL_CONDITIONS_FIELDS_UI = {
  introHint:
    'Marca las opciones que correspondan a tu situación actual. Si no estás seguro, elige la más cercana a la realidad.',
  groupClinical: 'Condiciones clínicas',
  groupFunctional: 'Discapacidad funcional',
  groupDiabetes: 'Diabetes',
  diabetesHint: 'Selecciona una opción.'
} as const;

export type MedicalConditionPill = {
  readonly control: keyof RegisterMedicalIn;
  readonly label: string;
};

export const MEDICAL_CLINICAL_PILLS: readonly MedicalConditionPill[] = [
  { control: 'had_angina', label: 'Angina' },
  { control: 'had_stroke', label: 'Accidente cerebrovascular' },
  { control: 'had_asthma', label: 'Asma' },
  { control: 'had_copd', label: 'EPOC' },
  { control: 'had_skin_cancer', label: 'Cáncer de piel' },
  { control: 'had_depressive_disorder', label: 'Trastorno depresivo' },
  { control: 'had_kidney_disease', label: 'Enfermedad renal' },
  { control: 'had_arthritis', label: 'Artritis' }
] as const;

export const MEDICAL_FUNCTIONAL_PILLS: readonly MedicalConditionPill[] = [
  { control: 'deaf_or_hard_of_hearing', label: 'Sordera o dificultad auditiva' },
  { control: 'blind_or_vision_difficulty', label: 'Ceguera o dificultad visual' },
  { control: 'difficulty_concentrating', label: 'Dificultad para concentrarse' },
  { control: 'difficulty_walking', label: 'Dificultad para caminar' },
  { control: 'difficulty_dressing_bathing', label: 'Dificultad para vestirse o bañarse' },
  { control: 'difficulty_errands', label: 'Dificultad para hacer recados' }
] as const;
