import {
  COVID_POS_OPTIONS,
  ECIGARETTE_USAGE_OPTIONS,
  GENERAL_HEALTH_OPTIONS,
  LAST_CHECKUP_OPTIONS,
  PREDICTION_HAD_DIABETES_OPTIONS,
  PREDICTION_REMOVED_TEETH_OPTIONS,
  PREDICTION_SEX_OPTIONS,
  SMOKER_STATUS_OPTIONS,
  TETANUS_OPTIONS
} from './data/prediction-survey-options.constant';
import { ANONYMOUS_PREDICTION_PAGE_UI } from './ui/prediction-ui.constant';

const normKey = (s: string): string => s.trim().replace(/\s+/g, '_').replace(/-+/g, '_').toLowerCase();

function mapFromLabeledOptions(options: readonly { readonly value: string; readonly label: string }[]): Record<string, string> {
  return Object.fromEntries(options.map((o) => [normKey(o.value), o.label]));
}

/** Valores compuestos «categoría_valor» (p. ej. salud general + nivel). */
export const SHAP_COMPOUND_VALUE_LABELS: Record<string, Record<string, string>> = {
  generalhealth: mapFromLabeledOptions(GENERAL_HEALTH_OPTIONS),
  smokerstatus: mapFromLabeledOptions(SMOKER_STATUS_OPTIONS),
  ecigaretteusage: mapFromLabeledOptions(ECIGARETTE_USAGE_OPTIONS),
  lastcheckuptime: mapFromLabeledOptions(LAST_CHECKUP_OPTIONS),
  tetanuslast10tdap: mapFromLabeledOptions(TETANUS_OPTIONS),
  covidpos: mapFromLabeledOptions(COVID_POS_OPTIONS),
  sex: mapFromLabeledOptions(PREDICTION_SEX_OPTIONS),
  removedteeth: mapFromLabeledOptions(PREDICTION_REMOVED_TEETH_OPTIONS),
  haddiabetes: mapFromLabeledOptions(PREDICTION_HAD_DIABETES_OPTIONS)
};

/** Prefijo de categoría (parte izquierda del nombre compuesto, normalizada). */
export const SHAP_COMPOUND_CATEGORY_PREFIX: Record<string, string> = {
  generalhealth: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.generalHealth,
  physicalhealthdays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalHealthDays,
  mentalhealthdays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.mentalHealthDays,
  lastcheckuptime: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.lastCheckup,
  physicalactivities: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalActivities,
  sleephours: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.sleepHours,
  smokerstatus: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.smokerStatus,
  ecigaretteusage: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.ecigaretteUsage,
  alcoholdrinkers: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.alcoholDrinkers,
  chestscan: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.chestScan,
  hivtesting: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.hivTesting,
  fluvaxlast12: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.fluVaxLast12,
  pneumovaxever: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.pneumoVaxEver,
  tetanuslast10tdap: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.tetanusLast10,
  highrisklastyear: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.highRiskLastYear,
  covidpos: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.covidPos,
  agecategory: 'Grupo de edad',
  sex: ANONYMOUS_PREDICTION_PAGE_UI.labels.sexApi,
  removedteeth: ANONYMOUS_PREDICTION_PAGE_UI.labels.removedTeeth,
  haddiabetes: ANONYMOUS_PREDICTION_PAGE_UI.labels.diabetes,
  bmi: 'Índice de masa corporal (IMC)',
  weightkilograms: ANONYMOUS_PREDICTION_PAGE_UI.labels.weightKilograms,
  heightmeters: ANONYMOUS_PREDICTION_PAGE_UI.labels.heightMeters,
  birthdate: ANONYMOUS_PREDICTION_PAGE_UI.labels.birthDate
};

/**
 * Nombres de variable / API (variantes) → título legible en español.
 * Claves en minúsculas con guiones bajos.
 */
export const SHAP_FEATURE_TITLE_MAP: Record<string, string> = {
  // Condiciones médicas (API snake_case y variantes)
  had_angina: 'Antecedentes de angina',
  hadangina: 'Antecedentes de angina',
  had_stroke: 'Antecedentes de accidente cerebrovascular',
  hadstroke: 'Antecedentes de accidente cerebrovascular',
  had_asthma: 'Antecedentes de asma',
  hadasthma: 'Antecedentes de asma',
  had_copd: 'Antecedentes de EPOC',
  hadcopd: 'Antecedentes de EPOC',
  had_skin_cancer: 'Antecedentes de cáncer de piel',
  hadskincancer: 'Antecedentes de cáncer de piel',
  had_depressive_disorder: 'Antecedentes de trastorno depresivo',
  haddepressivedisorder: 'Antecedentes de trastorno depresivo',
  had_kidney_disease: 'Antecedentes de enfermedad renal',
  hadkidneydisease: 'Antecedentes de enfermedad renal',
  had_arthritis: 'Antecedentes de artritis',
  hadarthritis: 'Antecedentes de artritis',
  deaf_or_hard_of_hearing: 'Sordera o dificultad auditiva',
  deaforhardofhearing: 'Sordera o dificultad auditiva',
  blind_or_vision_difficulty: 'Ceguera o dificultad visual',
  blindorvisiondifficulty: 'Ceguera o dificultad visual',
  difficulty_concentrating: 'Dificultad para concentrarse',
  difficultyconcentrating: 'Dificultad para concentrarse',
  difficulty_walking: 'Dificultad para caminar',
  difficultywalking: 'Dificultad para caminar',
  difficulty_dressing_bathing: 'Dificultad para vestirse o bañarse',
  difficultydressingbathing: 'Dificultad para vestirse o bañarse',
  difficulty_errands: 'Dificultad para hacer recados',
  difficultyerrands: 'Dificultad para hacer recados',
  general_health: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.generalHealth,
  generalhealth: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.generalHealth,
  physical_health_days: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalHealthDays,
  physicalhealthdays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalHealthDays,
  mental_health_days: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.mentalHealthDays,
  mentalhealthdays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.mentalHealthDays,
  last_checkup_time: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.lastCheckup,
  lastcheckuptime: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.lastCheckup,
  physical_activities: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalActivities,
  physicalactivities: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalActivities,
  sleep_hours: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.sleepHours,
  sleephours: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.sleepHours,
  smoker_status: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.smokerStatus,
  smokerstatus: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.smokerStatus,
  ecigarette_usage: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.ecigaretteUsage,
  ecigaretteusage: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.ecigaretteUsage,
  alcohol_drinkers: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.alcoholDrinkers,
  alcoholdrinkers: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.alcoholDrinkers,
  chest_scan: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.chestScan,
  chestscan: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.chestScan,
  hiv_testing: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.hivTesting,
  hivtesting: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.hivTesting,
  flu_vax_last_12: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.fluVaxLast12,
  fluvaxlast12: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.fluVaxLast12,
  pneumo_vax_ever: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.pneumoVaxEver,
  pneumovaxever: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.pneumoVaxEver,
  tetanus_last_10_tdap: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.tetanusLast10,
  tetanuslast10tdap: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.tetanusLast10,
  high_risk_last_year: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.highRiskLastYear,
  highrisklastyear: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.highRiskLastYear,
  covid_pos: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.covidPos,
  covidpos: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.covidPos,
  weight_kilograms: ANONYMOUS_PREDICTION_PAGE_UI.labels.weightKilograms,
  weightkilograms: ANONYMOUS_PREDICTION_PAGE_UI.labels.weightKilograms,
  bmi: 'Índice de masa corporal (IMC)',
  sex: ANONYMOUS_PREDICTION_PAGE_UI.labels.sexApi,
  birth_date: ANONYMOUS_PREDICTION_PAGE_UI.labels.birthDate,
  birthdate: ANONYMOUS_PREDICTION_PAGE_UI.labels.birthDate,
  height_meters: ANONYMOUS_PREDICTION_PAGE_UI.labels.heightMeters,
  heightmeters: ANONYMOUS_PREDICTION_PAGE_UI.labels.heightMeters,
  removed_teeth: ANONYMOUS_PREDICTION_PAGE_UI.labels.removedTeeth,
  removedteeth: ANONYMOUS_PREDICTION_PAGE_UI.labels.removedTeeth,
  had_diabetes: ANONYMOUS_PREDICTION_PAGE_UI.labels.diabetes,
  haddiabetes: ANONYMOUS_PREDICTION_PAGE_UI.labels.diabetes,
  age_category: 'Grupo de edad',
  agecategory: 'Grupo de edad',
  prediction_probability: 'Probabilidad estimada por el modelo',
  risk_level: 'Nivel de riesgo informado'
};

/** Sinónimos de dirección (normalizados) → tipo de impacto. */
export const SHAP_DIRECTION_TO_KIND: Record<string, 'increase' | 'decrease' | 'neutral'> = {
  increases_risk: 'increase',
  increase_risk: 'increase',
  increased_risk: 'increase',
  increase: 'increase',
  higher_risk: 'increase',
  higher: 'increase',
  positive: 'increase',
  pos: 'increase',
  up: 'increase',
  decreases_risk: 'decrease',
  decrease_risk: 'decrease',
  decreased_risk: 'decrease',
  decrease: 'decrease',
  lower_risk: 'decrease',
  lower: 'decrease',
  negative: 'decrease',
  neg: 'decrease',
  down: 'decrease',
  neutral: 'neutral',
  no_effect: 'neutral',
  none: 'neutral',
  unchanged: 'neutral'
};

/**
 * Etiquetas de edad u otros sufijos compuestos frecuentes (clave = fragmento normalizado).
 */
/** Valores booleanos o binarios en sufijos compuestos. */
export const SHAP_BOOLEAN_VALUE_LABELS: Record<string, string> = {
  'true': 'Sí',
  'false': 'No',
  '1': 'Sí',
  '0': 'No',
  yes: 'Sí',
  no: 'No'
};

export const SHAP_AGE_CATEGORY_SUFFIX_LABELS: Record<string, string> = {
  age_18_to_24: 'De 18 a 24 años',
  age_25_to_29: 'De 25 a 29 años',
  age_30_to_34: 'De 30 a 34 años',
  age_35_to_39: 'De 35 a 39 años',
  age_40_to_44: 'De 40 a 44 años',
  age_45_to_49: 'De 45 a 49 años',
  age_50_to_54: 'De 50 a 54 años',
  age_55_to_59: 'De 55 a 59 años',
  age_60_to_64: 'De 60 a 64 años',
  age_65_to_69: 'De 65 a 69 años',
  age_70_to_74: 'De 70 a 74 años',
  age_75_to_79: 'De 75 a 79 años',
  age_80_or_older: '80 años o más',
  age_18_24: 'De 18 a 24 años',
  age_25_29: 'De 25 a 29 años',
  age_30_34: 'De 30 a 34 años',
  age_35_39: 'De 35 a 39 años',
  age_40_44: 'De 40 a 44 años',
  age_45_49: 'De 45 a 49 años',
  age_50_54: 'De 50 a 54 años',
  age_55_59: 'De 55 a 59 años',
  age_60_64: 'De 60 a 64 años',
  age_65_69: 'De 65 a 69 años',
  age_70_74: 'De 70 a 74 años',
  age_75_79: 'De 75 a 79 años'
};

/** Umbrales de intensidad relativos al máximo |contribución| del listado actual. */
export const SHAP_INTENSITY_RELATIVE_THRESHOLDS = {
  high: 0.66,
  medium: 0.33
} as const;

/** Textos de capa amigable SHAP (visible y panel técnico). */
export const SHAP_DISPLAY_UI = {
  fallbackUnknownFeature: 'Factor de salud',
  impactIncrease: 'Aumenta el riesgo',
  impactDecrease: 'Disminuye el riesgo',
  impactNeutral: 'Efecto neutro',
  impactUnknown: 'Impacto no clasificado',
  intensityHigh: 'Intensidad: alta',
  intensityMedium: 'Intensidad: media',
  intensityLow: 'Intensidad: baja',
  explanationIncrease:
    'Según el modelo, este factor empuja la estimación de probabilidad hacia valores más altos. No es un diagnóstico: resume cómo influyen los datos en esta predicción.',
  explanationDecrease:
    'Según el modelo, este factor ayuda a mantener la estimación de probabilidad en valores más bajos. No es un diagnóstico: resume cómo influyen los datos en esta predicción.',
  explanationNeutral:
    'Este factor tiene un efecto moderado o equilibrado en la estimación. La interpretación exacta depende del resto de tus respuestas.',
  moreContextHeading: 'Más detalle',
  technicalSectionTitle: 'Detalles técnicos (opcional)',
  technicalSectionHint: 'Aquí se muestran los nombres y valores tal como los recibe el modelo. Puedes ignorarlo si solo quieres la idea general.',
  technicalLabels: {
    internalFeatureName: 'Nombre interno de la variable',
    rawDirection: 'Código de dirección (API)',
    contributionScore: 'Puntuación de contribución (SHAP)',
    modelValue: 'Valor numérico en el modelo',
    apiInterpretation: 'Texto de interpretación (API)',
    apiMessage: 'Mensaje técnico (API)',
    impactScore: 'Puntuación de impacto (API)'
  },
  /** Subcadenas que sugieren texto técnico / depuración (no mostrar como «lenguaje natural» principal). */
  technicalInterpretationHints: [
    'input vector',
    'feature vector',
    'shap value',
    'model input',
    'increases_risk',
    'decreases_risk',
    'increase_risk',
    'decrease_risk',
    'numpy',
    'tensor',
    'baseline'
  ]
} as const;
