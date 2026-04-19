import { ANONYMOUS_PREDICTION_PAGE_UI, AUTHENTICATED_PREDICTION_PAGE_UI, PREDICTION_FORM_SHARED_UI } from './prediction-ui.constant';

/** Textos de la sección «qué pasaría si» en el detalle de predicción. */
export const PREDICTION_SIMULATION_UI = {
  sectionTitle: 'Simulación «qué pasaría si»',
  sectionIntro:
    'Ajusta solo las variables permitidas y calcula un escenario alternativo. Esta acción no guarda una nueva predicción en tu historial.',
  nonPersistentHint:
    'El resultado mostrado es provisional: no sustituye la predicción guardada ni queda registrado como predicción normal.',
  submitIdle: 'Calcular simulación',
  submitPending: 'Simulando…',
  resetForm: 'Restaurar valores originales',
  clearResult: 'Ocultar resultado simulado',
  comparisonSectionTitle: 'Comparación original vs simulado',
  labels: {
    originalProbability: 'Probabilidad original',
    simulatedProbability: 'Probabilidad simulada',
    originalRisk: 'Nivel de riesgo original',
    simulatedRisk: 'Nivel de riesgo simulado',
    probabilityDifference: 'Diferencia de probabilidad',
    changedFields: 'Campos modificados respecto al detalle cargado',
    noFieldChangesDetected: 'Ninguno (el servicio no devolvió cambios explícitos)',
    shapSection: 'Explicación SHAP (simulación)',
    shapFactorsSection: 'Factores SHAP (simulación)',
    recommendationsSection: 'Recomendaciones (simulación)'
  },
  fieldLabels: {
    weightKilograms: AUTHENTICATED_PREDICTION_PAGE_UI.labels.weightKilograms,
    generalHealth: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.generalHealth,
    physicalHealthDays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalHealthDays,
    mentalHealthDays: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.mentalHealthDays,
    physicalActivities: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.physicalActivities,
    sleepHours: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.sleepHours,
    smokerStatus: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.smokerStatus,
    ecigaretteUsage: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.ecigaretteUsage,
    alcoholDrinkers: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels.alcoholDrinkers
  },
  fieldKeys: {
    weight_kilograms: 'Peso (kg)',
    general_health: 'Estado de salud general',
    physical_health_days: 'Días con mala salud física',
    mental_health_days: 'Días con mala salud mental',
    physical_activities: 'Actividad física o ejercicio',
    sleep_hours: 'Horas de sueño',
    smoker_status: 'Estado de tabaquismo',
    ecigarette_usage: 'Uso de cigarrillos electrónicos',
    alcohol_drinkers: 'Consume alcohol'
  },
  loadingAriaLabel: 'Calculando simulación',
  probabilitySuffix: '%',
  probabilityDifferenceUnit: 'puntos porcentuales',
  optionalBlankLabel: PREDICTION_FORM_SHARED_UI.optionalBlankLabel,
  hints: {
    healthDays: ANONYMOUS_PREDICTION_PAGE_UI.surveyHints.healthDays,
    sleepHours: ANONYMOUS_PREDICTION_PAGE_UI.surveyHints.sleepHours,
    weightRange: ANONYMOUS_PREDICTION_PAGE_UI.hints.weightRange
  },
  rankNumberPrefix: '#',
  emDash: '—'
} as const;
