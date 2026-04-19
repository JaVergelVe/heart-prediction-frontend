import { GeneralHealth, SmokerStatus, EcigaretteUsage } from './prediction-api.model';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from './prediction-response.model';

/** Cuerpo permitido para POST `/v1/predictions/{id}/simulate` (solo variables modificables). */
export type PredictionSimulateRequestBody = Partial<{
  weight_kilograms: number;
  physical_activities: boolean | null;
  sleep_hours: number | null;
  general_health: GeneralHealth | null;
  physical_health_days: number | null;
  mental_health_days: number | null;
  smoker_status: SmokerStatus | null;
  ecigarette_usage: EcigaretteUsage | null;
  alcohol_drinkers: boolean | null;
}>;

/** Estado normalizado de los campos editables (comparación y diff). */
export interface PredictionSimulationNormalizedState {
  weight_kilograms: number;
  general_health: string | null;
  physical_health_days: number | null;
  mental_health_days: number | null;
  physical_activities: boolean | null;
  sleep_hours: number | null;
  smoker_status: string | null;
  ecigarette_usage: string | null;
  alcohol_drinkers: boolean | null;
}

/** Resultado unificado tras simular (independiente de la forma exacta del JSON del API). */
export interface PredictionSimulationViewModel {
  simulated: PredictionResultData;
  originalProbability: number;
  simulatedProbability: number;
  originalRiskLevel: string;
  simulatedRiskLevel: string;
  probabilityDifference: number;
  changedFieldKeys: readonly string[];
  shapExplanation: ShapExplanation | null;
  shapFactors: readonly ShapTopFactor[];
  recommendations: readonly string[];
}
