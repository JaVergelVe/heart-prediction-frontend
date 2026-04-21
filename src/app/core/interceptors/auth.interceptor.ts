import { HttpInterceptorFn } from '@angular/common/http';
import { API_PATHS } from '../constants/api-paths.constant';
import { HTTP_AUTH } from '../constants/http-auth.constant';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

/** Predicción anónima: debe ir sin JWT aunque haya sesión (p. ej. tras login/registro). */
function isAnonymousPredictionUrl(url: string): boolean {
  return url.includes(API_PATHS.predictionAnonymous);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (!token?.trim()) {
    return next(req);
  }
  if (isAnonymousPredictionUrl(req.url)) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: { Authorization: `${HTTP_AUTH.bearerScheme} ${token}` }
    })
  );
};
