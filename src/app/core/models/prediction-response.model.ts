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
