import {
  PREDICTION_RISK_LEVEL_KEYWORDS,
  PredictionRiskPillKind
} from '../constants/prediction-result-risk.constant';

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
