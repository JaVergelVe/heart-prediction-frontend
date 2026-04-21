import { APP_ROUTE_URLS, HOME_ROUTE_ACTIVE_OPTIONS } from '../route-urls.constant';

const SHELL_NAV_LABEL_PREDICTION_AUTHENTICATED = 'Mi predicción' as const;

/** Título corto de producto reutilizado en cabecera y cajón lateral. */
const SHELL_APP_TITLE = 'Riesgo cardiovascular' as const;

export type MainNavLink = {
  readonly label: string;
  readonly routerLink: string;
  readonly routerLinkActiveOptions?: typeof HOME_ROUTE_ACTIVE_OPTIONS;
  /** Solo visible con sesión iniciada (rutas protegidas). */
  readonly requiresAuth?: boolean;
  /** Solo visible sin sesión (p. ej. enlaces a login y registro). */
  readonly requiresGuest?: boolean;
};

/** Barra superior y pie de página. */
export const SHELL_HEADER_UI = {
  title: SHELL_APP_TITLE,
  /** Línea secundaria bajo el título en la barra superior. */
  tagline: 'Estimación orientativa a partir de tus respuestas',
  menuButtonAriaLabel: 'Abrir menú de navegación'
} as const;

export const SHELL_FOOTER_UI = {
  line: 'Estimación orientativa · consulta ante cualquier duda a tu equipo sanitario'
} as const;

/** Accesibilidad y textos del contenedor principal (sin copia de producto en plantillas). */
export const SHELL_MAIN_LAYOUT_UI = {
  sidenavAriaLabel: 'Menú lateral',
  sidenavNavAriaLabel: 'Navegación principal',
  /** Encabezado visual del cajón lateral (marca). */
  sidenavProductLine: SHELL_APP_TITLE,
  /** Etiqueta de sección sobre la lista de enlaces. */
  sidenavNavSectionLabel: 'Menú',
  /** Acción de salida con sesión iniciada. */
  logoutLabel: 'Cerrar sesión',
  logoutAriaLabel: 'Cerrar sesión y volver a la pantalla de acceso'
} as const;

/** Enlaces del menú lateral. */
export const SHELL_MAIN_NAV_LINKS: readonly MainNavLink[] = [
  { label: 'Inicio', routerLink: APP_ROUTE_URLS.home, routerLinkActiveOptions: HOME_ROUTE_ACTIVE_OPTIONS },
  { label: 'Predicción sin cuenta', routerLink: APP_ROUTE_URLS.predictionsAnonymous },
  {
    label: SHELL_NAV_LABEL_PREDICTION_AUTHENTICATED,
    routerLink: APP_ROUTE_URLS.predictionsAuthenticated,
    requiresAuth: true
  },
  { label: 'Historial', routerLink: APP_ROUTE_URLS.history, requiresAuth: true },
  { label: 'Perfil', routerLink: APP_ROUTE_URLS.profile, requiresAuth: true },
  { label: 'Iniciar sesión', routerLink: APP_ROUTE_URLS.authLogin, requiresGuest: true },
  { label: 'Registro', routerLink: APP_ROUTE_URLS.authRegister, requiresGuest: true }
] as const;
