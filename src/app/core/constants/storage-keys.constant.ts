/** Claves de `localStorage` compartidas entre servicios e interceptores. */
export const STORAGE_KEYS = {
  authToken: 'heart_prediction_auth_token',
  /** Identificador de sesión anónima estable (UUID) para POST /v1/predictions/anonymous. */
  anonymousPredictionSessionId: 'heart_prediction_anonymous_session_id'
} as const;
