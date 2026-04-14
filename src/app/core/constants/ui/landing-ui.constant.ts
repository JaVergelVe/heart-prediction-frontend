import { APP_ROUTE_URLS } from '../route-urls.constant';

/** Contenido de la página pública de bienvenida. */
export const LANDING_PAGE_UI = {
  cardTitle: 'Evaluación de riesgo cardíaco',
  lead: 'Explora una predicción anónima sin iniciar sesión o accede con tu cuenta al historial y al perfil.',
  primaryCta: 'Probar predicción anónima',
  secondaryLogin: 'Iniciar sesión',
  secondaryRegister: 'Crear cuenta',
  routes: {
    anonymousPrediction: APP_ROUTE_URLS.predictionsAnonymous,
    login: APP_ROUTE_URLS.authLogin,
    register: APP_ROUTE_URLS.authRegister
  }
} as const;
