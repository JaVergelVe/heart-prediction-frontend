import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_PATHS } from '../constants/api-paths.constant';
import { APP_ROUTE_URLS } from '../constants/route-urls.constant';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

/** Peticiones de credenciales donde un 401 es error de validación, no fin de sesión. */
function isCredentialAuthRequestUrl(url: string): boolean {
  return url.includes(API_PATHS.authLogin) || url.includes(API_PATHS.authRegister);
}

function clearStoredAuthToken(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.authToken);
  }
}

/**
 * Ante 401 en llamadas autenticadas: limpia el token y envía al login.
 * No actúa en login/registro para no interferir con errores de credenciales.
 */
export const unauthorizedResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
          return;
        }
        const url = err.url ?? req.url;
        if (isCredentialAuthRequestUrl(url)) {
          return;
        }
        clearStoredAuthToken();
        void router.navigateByUrl(APP_ROUTE_URLS.authLogin, { replaceUrl: true });
      }
    })
  );
};
