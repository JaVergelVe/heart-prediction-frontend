import { ROUTE_SEGMENTS } from './route-segments.constant';

const s = ROUTE_SEGMENTS;

/** Rutas absolutas de la aplicación (navegación, routerLink, redirect). */
export const APP_ROUTE_URLS = {
  home: '/',
  authLogin: `/${s.auth}/${s.login}`,
  authRegister: `/${s.auth}/${s.register}`,
  predictionsAnonymous: `/${s.predictions}/${s.anonymous}`,
  predictionsAnonymousResult: `/${s.predictions}/${s.anonymous}/${s.result}`,
  predictionsAuthenticated: `/${s.predictions}/${s.authenticated}`,
  predictionsAuthenticatedResult: `/${s.predictions}/${s.authenticated}/${s.result}`,
  history: `/${s.history}`,
  profile: `/${s.profile}`
} as const;

/** Opciones de `routerLinkActive` para la ruta raíz. */
export const HOME_ROUTE_ACTIVE_OPTIONS = { exact: true } as const;
