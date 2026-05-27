/** Segmentos de ruta usados en RouterModule y al construir URL trees. */
export const ROUTE_SEGMENTS = {
  auth: 'auth',
  login: 'login',
  register: 'register',
  predictions: 'predictions',
  anonymous: 'anonymous',
  authenticated: 'authenticated',
  result: 'result',
  history: 'history',
  profile: 'profile'
} as const;
