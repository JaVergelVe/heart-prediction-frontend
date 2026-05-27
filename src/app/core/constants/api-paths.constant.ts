/** Rutas relativas del API (prefijo según entorno). */
export const API_PATHS = {
  authLogin: '/v1/auth/login',
  authRegister: '/v1/auth/register',
  predictionAnonymous: '/v1/predictions/anonymous',
  predictionAuthenticated: '/v1/predictions',
  predictionHistory: '/v1/predictions/history',
  usersMe: '/v1/users/me',
  usersMeProfile: '/v1/users/me/profile',
  usersMeMedicalConditions: '/v1/users/me/medical-conditions'
} as const;
