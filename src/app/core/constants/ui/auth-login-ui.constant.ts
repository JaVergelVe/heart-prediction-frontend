import { APP_ROUTE_URLS } from '../route-urls.constant';

/** Textos de la pantalla de inicio de sesión. */
export const LOGIN_PAGE_UI = {
  cardTitle: 'Iniciar sesión',
  cardSubtitle: 'Accede con tu correo y contraseña',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  submitIdle: 'Entrar',
  submitPending: 'Entrando…',
  registerPrompt: '¿No tienes cuenta?',
  registerLink: 'Crear cuenta',
  registerRoute: APP_ROUTE_URLS.authRegister
} as const;
