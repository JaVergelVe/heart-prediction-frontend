/**
 * Palabras clave normalizadas (minúsculas) para aplicar estilo al nivel de riesgo mostrado por el API.
 * El backend puede enviar etiquetas en inglés u otras variantes.
 */
export const PREDICTION_RISK_LEVEL_KEYWORDS = {
  low: ['low', 'bajo'] as const,
  medium: ['medium', 'moderate', 'medio', 'moderado'] as const,
  high: ['high', 'elevado', 'alto'] as const
} as const;

export type PredictionRiskPillKind = 'low' | 'medium' | 'high' | 'unknown';
