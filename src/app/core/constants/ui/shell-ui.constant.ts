import { APP_ROUTE_URLS, HOME_ROUTE_ACTIVE_OPTIONS } from '../route-urls.constant';

export type MainNavLink = {
  readonly label: string;
  readonly routerLink: string;
  readonly routerLinkActiveOptions?: typeof HOME_ROUTE_ACTIVE_OPTIONS;
};

/** Barra superior y pie de página. */
export const SHELL_HEADER_UI = {
  title: 'Predicción de riesgo cardíaco',
  menuButtonAriaLabel: 'Menú'
} as const;

export const SHELL_FOOTER_UI = {
  line: 'Heart Prediction · Frontend'
} as const;

/** Enlaces del menú lateral. */
export const SHELL_MAIN_NAV_LINKS: readonly MainNavLink[] = [
  { label: 'Inicio', routerLink: APP_ROUTE_URLS.home, routerLinkActiveOptions: HOME_ROUTE_ACTIVE_OPTIONS },
  { label: 'Predicción anónima', routerLink: APP_ROUTE_URLS.predictionsAnonymous },
  { label: 'Historial', routerLink: APP_ROUTE_URLS.history },
  { label: 'Perfil', routerLink: APP_ROUTE_URLS.profile },
  { label: 'Iniciar sesión', routerLink: APP_ROUTE_URLS.authLogin },
  { label: 'Registro', routerLink: APP_ROUTE_URLS.authRegister }
] as const;
