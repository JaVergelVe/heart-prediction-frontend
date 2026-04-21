import { APP_ROUTE_URLS } from '../route-urls.constant';
import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Textos compartidos entre formularios de predicción. */
export const PREDICTION_FORM_SHARED_UI = {
  optionalBlankLabel: 'Sin especificar',
  badgeOptional: 'Opcional',
  badgeRequired: 'Obligatorio'
} as const;

/** Clase CSS del panel de `mat-select` (estilos en `_prediction-forms.scss`); no es copy de producto. */
export const PREDICTION_FORM_LAYOUT_UI = {
  matSelectPanelClass: 'prediction-select-panel'
} as const;

/** Origen del flujo para la pantalla de resultado (estado de navegación). */
export const PREDICTION_FLOW_KIND = {
  anonymous: 'anonymous',
  authenticated: 'authenticated'
} as const;

export type PredictionFlowKind = (typeof PREDICTION_FLOW_KIND)[keyof typeof PREDICTION_FLOW_KIND];

/** Textos: predicción anónima (formulario completo). */
export const ANONYMOUS_PREDICTION_PAGE_UI = {
  pageEyebrow: 'Evaluación de riesgo',
  cardTitle: 'Predicción sin cuenta',
  cardSubtitle:
    'Completa primero perfil y peso, y después las condiciones médicas (obligatorio). El cuestionario de hábitos es opcional: despliega el último panel si quieres añadirlo.',
  /** Texto introductorio bajo la cabecera: cómo recorrer el formulario. */
  formGuide:
    'Los paneles obligatorios llevan la etiqueta «Obligatorio». Puedes tener varios abiertos a la vez. Revisa cada bloque con calma antes de enviar.',
  sections: {
    survey: 'Cuestionario de salud (opcional)',
    profileAndVitals: 'Perfil y signos vitales',
    medical: 'Condiciones médicas y discapacidad'
  },
  /** Títulos dentro de un mismo panel (jerarquía visual). */
  panelSubsections: {
    personalData: 'Datos personales',
    medicalChecklist: 'Antecedentes y limitaciones'
  },
  sectionDescriptions: {
    profileAndVitals:
      'Sexo, edad, talla, dentición y peso actual: obligatorios para el modelo y para calcular el IMC.',
    vitalsShort: 'Indica tu peso en kilogramos con el mismo criterio que usarías en una báscula habitual.',
    medical: 'Antecedentes y limitaciones funcionales. Todas las casillas y la diabetes son obligatorias.',
    survey: 'Hábitos, vacunas y percepción de salud. Puedes omitirlo o dejar “Sin especificar” donde aplique.'
  },
  surveyPanelCollapsedHint: 'Opcional: despliega para añadir hábitos y prevención.',
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
    sexApi: 'Sexo biológico',
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
    'Marca Sí o No según tu situación actual. Si no estás seguro, elige la opción más cercana a la realidad.',
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
  hints: ANONYMOUS_PREDICTION_PAGE_UI.surveyHints,
  intro:
    'Las preguntas con “Sin especificar” son opcionales. El resto de listas debe elegirse con los mismos valores que en el registro, cuando apliquen. El bloque está agrupado en tres partes para que sea más fácil de revisar.',
  subsections: {
    wellbeing: 'Estado de salud y bienestar',
    lifestyle: 'Hábitos y estilo de vida',
    prevention: 'Prevención y cribados'
  },
  subsectionHints: {
    wellbeing: 'Percepción de salud, días con malestar y seguimiento médico reciente.',
    lifestyle: 'Actividad, sueño y hábitos relacionados con tabaco, alcohol y similares.',
    prevention: 'Vacunas, cribados y exposiciones recientes relevantes para el modelo.'
  }
} as const;

/** Textos: predicción autenticada (peso + cuestionario opcional). */
export const AUTHENTICATED_PREDICTION_PAGE_UI = {
  pageEyebrow: 'Con tu perfil guardado',
  cardTitle: 'Predicción con tu cuenta',
  cardSubtitle:
    'Actualiza tu peso y, si lo deseas, completa el cuestionario opcional. El resto de tu ficha ya está guardada en tu cuenta.',
  formGuide:
    'Solo el peso es obligatorio en esta pantalla. El cuestionario amplía contexto y es opcional: ábrelo cuando quieras completarlo.',
  sections: {
    survey: 'Cuestionario de salud (opcional)',
    vitals: 'Signos vitales'
  },
  sectionDescriptions: {
    vitals: 'Solo el peso es obligatorio aquí; el resto de tu ficha ya está asociada a tu cuenta.',
    survey: 'Refina el resultado con hábitos y prevención. Todo este bloque es opcional.'
  },
  surveyPanelCollapsedHint: 'Opcional: hábitos, vacunas y bienestar.',
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
  /** Prefijo visual del rango en tarjetas SHAP (p. ej. «#1»). */
  rankNumberPrefix: '#',
  cardTitle: 'Resultado de predicción',
  cardSubtitleWithData: 'Resumen del último cálculo de esta visita.',
  noDataTitle: 'No hay resultado para mostrar',
  noDataBody:
    'El resultado solo se muestra al venir del formulario justo después de un cálculo correcto. Si abriste esta página directamente o la recargaste, ya no está disponible aquí.',
  noDataHint:
    'Puedes iniciar una nueva predicción sin cuenta o, si tienes cuenta, desde la predicción asociada a tu perfil.',
  noDataIconAriaLabel: 'Información: resultado no disponible en esta pantalla',
  partialStateHint:
    'Hay un resultado guardado en el navegador, pero no sabemos si venías del modo sin cuenta o con cuenta. Elige por dónde quieres continuar.',
  sections: {
    summary: 'Resumen',
    details: 'Detalles',
    shapMain: 'Factor con mayor influencia',
    shapFactors: 'Otros factores destacados',
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
    modelVersionUnavailable: 'No disponible',
    bmiUnavailable: 'No incluido en este resultado',
    timestamp: 'Fecha y hora',
    predictionId: 'Referencia de la predicción',
    recommendations: 'Recomendaciones',
    bmi: 'IMC',
    predictedClass: 'Categoría según el modelo',
    shapFeature: 'Variable',
    shapImpact: 'Importancia relativa',
    shapDirection: 'Dirección',
    shapMessage: 'Mensaje',
    shapRank: 'Orden',
    shapContribution: 'Contribución',
    shapValue: 'Valor en el modelo',
    shapInterpretation: 'Interpretación',
    /** Cuando la API no devuelve nombre de variable en un factor SHAP. */
    factorNameUnavailable: 'Variable sin etiqueta'
  },
  fallbackNavAnonymous: 'Ir a predicción sin cuenta',
  fallbackNavAuthenticated: 'Ir a predicción con cuenta',
  backToAnonymous: 'Volver a predicción sin cuenta',
  backToAuthenticated: 'Volver a predicción con cuenta',
  loginPrompt: '¿Quieres guardar historial en tu cuenta?',
  loginLink: 'Iniciar sesión',
  loginRoute: APP_ROUTE_URLS.authLogin
} as const;
