import { APP_ROUTE_URLS } from '../route-urls.constant';
import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Textos compartidos entre formularios de predicción. */
export const PREDICTION_FORM_SHARED_UI = {
  optionalBlankLabel: 'Sin especificar'
} as const;

/** Origen del flujo para la pantalla de resultado (estado de navegación). */
export const PREDICTION_FLOW_KIND = {
  anonymous: 'anonymous',
  authenticated: 'authenticated'
} as const;

export type PredictionFlowKind = (typeof PREDICTION_FLOW_KIND)[keyof typeof PREDICTION_FLOW_KIND];

/** Textos: predicción anónima (formulario completo). */
export const ANONYMOUS_PREDICTION_PAGE_UI = {
  cardTitle: 'Predicción anónima',
  cardSubtitle:
    'Completa perfil, condiciones médicas y peso. Los campos del cuestionario adicional son opcionales.',
  sections: {
    survey: 'Cuestionario de salud (opcional)',
    profile: 'Perfil',
    medical: 'Condiciones médicas y discapacidad',
    vitals: 'Signos vitales'
  },
  sessionHint: 'Se usa un identificador de sesión anónima almacenado en este navegador.',
  surveyLabels: {
    generalHealth: 'Estado de salud general',
    physicalHealthDays: 'Días con mala salud física (último mes)',
    mentalHealthDays: 'Días con mala salud mental (último mes)',
    lastCheckup: 'Último chequeo médico',
    physicalActivities: 'Actividad física o ejercicio',
    sleepHours: 'Horas de sueño en promedio (24 h)',
    smokerStatus: 'Estado de tabaquismo',
    ecigaretteUsage: 'Uso de cigarrillos electrónicos',
    alcoholDrinkers: 'Consume alcohol',
    chestScan: 'Alguna vez le hicieron TAC o radiografía de tórax',
    hivTesting: 'Se ha hecho prueba de VIH',
    fluVaxLast12: 'Vacuna de gripe en los últimos 12 meses',
    pneumoVaxEver: 'Alguna vez vacuna neumocócica',
    tetanusLast10: 'Vacuna antitetánica / Tdap en los últimos 10 años',
    highRiskLastYear: 'Alto riesgo de enfermedad grave el último año',
    covidPos: 'Resultado COVID-19 conocido'
  },
  surveyHints: {
    healthDays: `Entre ${L.healthDaysMin} y ${L.healthDaysMax}`,
    sleepHours: `Entre ${L.sleepHoursMin} y ${L.sleepHoursMax}`
  },
  labels: {
    sexApi: 'Sexo (valor enviado al API)',
    birthDate: 'Fecha de nacimiento',
    heightMeters: 'Altura (metros)',
    removedTeeth: 'Dientes extraídos',
    diabetes: 'Diabetes',
    weightKilograms: 'Peso (kg)'
  },
  hints: {
    heightRange: 'Entre 0,5 y 2,5',
    weightRange: `Entre ${L.weightKgMin} y ${L.weightKgMax} kg`
  },
  medicalSectionHint:
    'Marca Sí o No según corresponda. Los valores se envían como booleanos al API.',
  medicalLabels: {
    hadAngina: '¿Angina?',
    hadStroke: '¿Accidente cerebrovascular?',
    hadAsthma: '¿Asma?',
    hadCopd: '¿EPOC?',
    hadSkinCancer: '¿Cáncer de piel?',
    hadDepressiveDisorder: '¿Trastorno depresivo?',
    hadKidneyDisease: '¿Enfermedad renal?',
    hadArthritis: '¿Artritis?',
    deafOrHardOfHearing: '¿Sordera o dificultad auditiva?',
    blindOrVisionDifficulty: '¿Ceguera o dificultad visual?',
    difficultyConcentrating: '¿Dificultad para concentrarse?',
    difficultyWalking: '¿Dificultad para caminar?',
    difficultyDressingBathing: '¿Dificultad para vestirse o bañarse?',
    difficultyErrands: '¿Dificultad para hacer recados?'
  },
  submitIdle: 'Obtener predicción',
  submitPending: 'Calculando…'
} as const;

/** Textos compartidos del bloque de cuestionario (opcional) en ambos flujos. */
export const PREDICTION_SURVEY_FIELDS_UI = {
  labels: ANONYMOUS_PREDICTION_PAGE_UI.surveyLabels,
  hints: ANONYMOUS_PREDICTION_PAGE_UI.surveyHints
} as const;

/** Textos: predicción autenticada (peso + cuestionario opcional). */
export const AUTHENTICATED_PREDICTION_PAGE_UI = {
  cardTitle: 'Predicción con tu cuenta',
  cardSubtitle:
    'El perfil y las condiciones médicas se cargan en el servidor desde tu cuenta. Indica tu peso y, si quieres, el cuestionario adicional.',
  sections: {
    survey: 'Cuestionario de salud (opcional)',
    vitals: 'Signos vitales'
  },
  labels: {
    weightKilograms: ANONYMOUS_PREDICTION_PAGE_UI.labels.weightKilograms
  },
  hints: {
    weightRange: ANONYMOUS_PREDICTION_PAGE_UI.hints.weightRange
  },
  submitIdle: 'Obtener predicción',
  submitPending: 'Calculando…'
} as const;

/** Textos: pantalla de resultado. */
export const PREDICTION_RESULT_UI = {
  cardTitle: 'Resultado de predicción',
  cardSubtitleWithData: 'Resumen del último cálculo enviado desde esta sesión.',
  noDataTitle: 'No hay resultado para mostrar',
  noDataBody:
    'Esta vista recibe los datos al navegar desde el formulario justo después de una predicción correcta. Si abriste el enlace directamente o recargaste la página, el resultado ya no está disponible en el navegador.',
  noDataHint: 'Puedes iniciar una nueva predicción desde el formulario anónimo o, si tienes cuenta, desde el formulario autenticado.',
  noDataIconAriaLabel: 'Información: resultado no disponible en esta vista',
  partialStateHint:
    'Hay datos de resultado pero no se reconoce el flujo (anónimo o con cuenta). Elige a qué formulario volver.',
  sections: {
    summary: 'Resumen',
    details: 'Detalles',
    shapMain: 'Factor principal (SHAP)',
    shapFactors: 'Factores destacados (SHAP)',
    recommendations: 'Recomendaciones'
  },
  units: {
    probabilitySuffix: '%'
  },
  labels: {
    probability: 'Probabilidad estimada',
    probabilityShort: 'Probabilidad',
    riskLevel: 'Nivel de riesgo',
    modelVersion: 'Versión del modelo',
    modelVersionUnavailable: 'No indicada por el servicio',
    bmiUnavailable: 'No incluido en esta respuesta',
    timestamp: 'Fecha y hora',
    predictionId: 'Identificador de predicción',
    recommendations: 'Recomendaciones',
    bmi: 'IMC',
    predictedClass: 'Clase predicha',
    shapFeature: 'Variable',
    shapImpact: 'Impacto (SHAP)',
    shapDirection: 'Dirección',
    shapMessage: 'Mensaje',
    shapRank: 'Orden',
    shapContribution: 'Contribución',
    shapValue: 'Valor en el modelo',
    shapInterpretation: 'Interpretación'
  },
  fallbackNavAnonymous: 'Ir al formulario anónimo',
  fallbackNavAuthenticated: 'Ir al formulario con cuenta',
  backToAnonymous: 'Volver a predicción anónima',
  backToAuthenticated: 'Volver a predicción con cuenta',
  loginPrompt: '¿Quieres guardar historial en tu cuenta?',
  loginLink: 'Iniciar sesión',
  loginRoute: APP_ROUTE_URLS.authLogin
} as const;
