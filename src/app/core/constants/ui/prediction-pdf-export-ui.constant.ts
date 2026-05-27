/** Textos del informe PDF generado en el cliente (español, legible). */
export const PREDICTION_PDF_EXPORT_UI = {
  title: 'Informe de predicción de riesgo cardiovascular',
  sections: {
    summary: 'Resumen',
    inputData: 'Datos de entrada relevantes',
    shap: 'Factores que influyeron en la estimación',
    shapMain: 'Factor con mayor influencia',
    shapFactors: 'Otros factores destacados',
    recommendations: 'Recomendaciones',
    disclaimer: 'Aviso legal'
  },
  labels: {
    probability: 'Probabilidad estimada',
    riskLevel: 'Nivel de riesgo',
    timestamp: 'Fecha y hora de la predicción',
    impact: 'Impacto',
    moreDetail: 'Más detalle'
  },
  values: {
    notAvailable: '—',
    yes: 'Sí',
    no: 'No',
    probabilitySuffix: '%'
  },
  shapUnavailable: 'No se pudo incluir la explicación de factores (perfil incompleto o datos insuficientes).',
  recommendationsEmpty: 'No hay recomendaciones generadas para este resultado.',
  factorRank: '#{rank} {title}',
  disclaimerParagraphs: [
    'Este documento es generado automáticamente con fines informativos y educativos. No constituye diagnóstico médico, consejo clínico ni sustituye la evaluación de un profesional de la salud.',
    'Los resultados se basan en un modelo estadístico y en los datos proporcionados; pueden ser incompletos o estar sujetos a error. Ante síntomas, antecedentes personales o dudas sobre su salud cardiovascular, consulte a su médico.'
  ],
  inputFields: {
    weightKilograms: 'Peso (kg)',
    bmi: 'IMC',
    generalHealth: 'Salud general',
    physicalHealthDays: 'Días con salud física no óptima (último mes)',
    mentalHealthDays: 'Días con salud mental no óptima (último mes)',
    lastCheckup: 'Último chequeo médico',
    physicalActivities: 'Actividad física',
    sleepHours: 'Horas de sueño (promedio)',
    smokerStatus: 'Estado de tabaquismo',
    ecigaretteUsage: 'Uso de cigarrillo electrónico',
    alcohol: 'Consumo de alcohol',
    chestScan: 'Estudio de tórax (CT)',
    hiv: 'Prueba de VIH',
    fluVax: 'Vacuna contra la gripe (últimos 12 meses)',
    pneumoVax: 'Vacuna neumocócica (alguna vez)',
    tetanus: 'Vacuna Tdap / tétanos (últimos 10 años)',
    highRiskYear: 'Alto riesgo de enfermedad (último año)',
    covid: 'COVID-19 positivo (autorreporte)'
  }
} as const;
