import {
  PREDICTION_RISK_LEVEL_KEYWORDS,
  PredictionRiskPillKind
} from '../constants/prediction-result-risk.constant';

const RISK_DISPLAY_LABELS: Record<PredictionRiskPillKind, string | null> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  unknown: null
};

/** Etiqueta en español para mostrar al usuario (el API suele enviar Low/Medium/High). */
export function predictionRiskDisplayLabel(riskLevel: string | null | undefined): string {
  const kind = predictionRiskPillKind(riskLevel);
  const mapped = RISK_DISPLAY_LABELS[kind];
  if (mapped) {
    return mapped;
  }
  const raw = (riskLevel ?? '').trim();
  return raw || '—';
}

/** Clasifica el texto de nivel de riesgo del API para aplicar estilos (pastillas). */
export function predictionRiskPillKind(riskLevel: string | null | undefined): PredictionRiskPillKind {
  const s = (riskLevel ?? '').trim().toLowerCase();
  const low = PREDICTION_RISK_LEVEL_KEYWORDS.low as readonly string[];
  const medium = PREDICTION_RISK_LEVEL_KEYWORDS.medium as readonly string[];
  const high = PREDICTION_RISK_LEVEL_KEYWORDS.high as readonly string[];
  if (low.includes(s)) {
    return 'low';
  }
  if (medium.includes(s)) {
    return 'medium';
  }
  if (high.includes(s)) {
    return 'high';
  }
  return 'unknown';
}
