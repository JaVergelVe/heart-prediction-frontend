import type { EcigaretteUsage, GeneralHealth, SmokerStatus } from './prediction-api.model';

/** Explicación SHAP principal (si el API la incluye). */
export interface ShapExplanation {
  feature_name?: string;
  impact_score?: number;
  direction?: string;
  message?: string;
}

/** Factor SHAP en el ranking (si el API lo incluye). */
export interface ShapTopFactor {
  feature_name?: string;
  feature_value?: number;
  contribution_score?: number;
  rank?: number;
  interpretation?: string;
  direction?: string;
}

/** Fragmento de respuesta bajo `data` tras crear una predicción (compatible con el API actual). */
export interface PredictionResultData {
  prediction_id: string;
  user_id: string | null;
  session_id?: string | null;
  weight_kilograms: number;
  /** Entradas del cuestionario que el detalle GET puede incluir para simulación o contexto. */
  general_health?: GeneralHealth | null;
  physical_health_days?: number | null;
  mental_health_days?: number | null;
  physical_activities?: boolean | null;
  sleep_hours?: number | null;
  smoker_status?: SmokerStatus | null;
  ecigarette_usage?: EcigaretteUsage | null;
  alcohol_drinkers?: boolean | null;
  bmi?: number;
  prediction_probability: number;
  risk_level: string;
  model_version?: string | null;
  prediction_timestamp: string;
  predicted_class?: string;
  recommendations?: string[];
  shap_explanation?: ShapExplanation | null;
  shap_top_factors?: ShapTopFactor[] | null;
}

export interface PredictionCreateEnvelope {
  data: PredictionResultData;
}

/** Respuesta de listado de historial (forma habitual `{ data: [...] }`). */
export interface PredictionHistoryListEnvelope {
  data: PredictionResultData[] | PredictionHistoryListData;
}

/** Variante paginada u objeto contenedor con ítems. */
export interface PredictionHistoryListData {
  items?: PredictionResultData[];
  predictions?: PredictionResultData[];
}
