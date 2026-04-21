import { HTTP_ERROR_MESSAGES } from '../messages/http-error-messages.constant';
import { APP_ROUTE_URLS } from '../route-urls.constant';

/** Mensajes de error HTTP específicos del flujo de inicio de sesión (sin detalle crudo del backend). */
export const LOGIN_HTTP_ERROR_MESSAGES = {
  invalidCredentials:
    'No pudimos iniciar sesión con esos datos. Comprueba el correo y la contraseña, o crea una cuenta si aún no te has registrado.',
  generic: HTTP_ERROR_MESSAGES.generic,
  offline: HTTP_ERROR_MESSAGES.offline
} as const;

/** Textos de la pantalla de inicio de sesión. */
export const LOGIN_PAGE_UI = {
  pageEyebrow: 'Acceso a la plataforma',
  cardTitle: 'Iniciar sesión',
  cardSubtitle: 'Introduce el correo y la contraseña de tu cuenta',
  credentialsHint: 'Si acabas de registrarte, usa el mismo correo y contraseña que elegiste al crear la cuenta.',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  errorRegionLabel: 'Mensaje del servidor',
  submitIdle: 'Entrar',
  submitPending: 'Entrando…',
  registerPrompt: '¿No tienes cuenta?',
  registerLink: 'Crear cuenta',
  registerRoute: APP_ROUTE_URLS.authRegister
} as const;
