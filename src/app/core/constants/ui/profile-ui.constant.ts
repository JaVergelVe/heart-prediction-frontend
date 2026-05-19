import { RegisterMedicalIn } from '../../models/register-request.model';

/** Textos y etiquetas de presentación de la vista de perfil. */
export const PROFILE_PAGE_UI = {
  pageTitle: 'Mi perfil',
  pageSubtitle: 'Gestiona tu información personal y condiciones de salud',
  sectionAccount: 'Cuenta',
  sectionProfileBase: 'Perfil base',
  subsectionFixedData: 'Datos fijos',
  subsectionEditableData: 'Datos editables',
  fixedDataHint: 'Sexo y fecha de nacimiento no son editables tras el registro.',
  emailLabel: 'Correo de la cuenta',
  emailUnavailable: 'No disponible',
  supportHintLink: '¿Necesitas corregirlos?',
  supportHintTooltip:
    'Si necesitas un cambio, contacta con soporte o sigue el procedimiento de tu institución.',
  birthDateUnavailable: 'No indicada',
  loadingAriaLabel: 'Cargando datos del perfil',
  saveProfile: 'Guardar cambios',
  saveProfilePending: 'Guardando perfil…',
  sectionMedical: 'Condiciones médicas y discapacidad',
  medicalHint: 'Marca Sí o No según tu situación actual. Si no estás seguro, elige la opción más cercana a la realidad.',
  groupClinical: 'Condiciones clínicas',
  groupFunctional: 'Discapacidad funcional',
  diabetesLabel: 'Diabetes',
  saveMedical: 'Guardar condiciones médicas',
  saveMedicalPending: 'Guardando condiciones médicas…',
  reload: 'Recargar datos'
} as const;

export type ProfileMedicalPill = {
  readonly control: keyof RegisterMedicalIn;
  readonly label: string;
};

export const PROFILE_CLINICAL_PILLS: readonly ProfileMedicalPill[] = [
  { control: 'had_angina', label: 'Angina' },
  { control: 'had_asthma', label: 'Asma' },
  { control: 'had_skin_cancer', label: 'Cáncer de piel' },
  { control: 'had_kidney_disease', label: 'Enfermedad renal' },
  { control: 'had_copd', label: 'EPOC' },
  { control: 'had_stroke', label: 'ACV' },
  { control: 'had_depressive_disorder', label: 'Trastorno depresivo' },
  { control: 'had_arthritis', label: 'Artritis' }
] as const;

export const PROFILE_FUNCTIONAL_PILLS: readonly ProfileMedicalPill[] = [
  { control: 'deaf_or_hard_of_hearing', label: 'Sordera' },
  { control: 'blind_or_vision_difficulty', label: 'Ceguera' },
  { control: 'difficulty_concentrating', label: 'Dificultad para concentrarse' },
  { control: 'difficulty_walking', label: 'Dificultad para caminar' },
  { control: 'difficulty_dressing_bathing', label: 'Dificultad para vestirse o bañarse' },
  { control: 'difficulty_errands', label: 'Dificultad para hacer recados' }
] as const;

export const PROFILE_DIABETES_PILLS: readonly {
  readonly value: RegisterMedicalIn['had_diabetes'];
  readonly label: string;
}[] = [
  { value: 'No', label: 'No' },
  { value: 'No, pre-diabetes or borderline diabetes', label: 'Prediabetes' },
  { value: 'Yes', label: 'Sí' }
] as const;

export const PROFILE_DIABETES_PREGNANCY_PILL: {
  readonly value: RegisterMedicalIn['had_diabetes'];
  readonly label: string;
} = {
  value: 'Yes, but only during pregnancy (female)',
  label: 'Sí, solo en embarazo'
};
