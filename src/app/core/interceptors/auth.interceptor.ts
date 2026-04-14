import { HttpInterceptorFn } from '@angular/common/http';
import { HTTP_AUTH } from '../constants/http-auth.constant';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (!token?.trim()) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: { Authorization: `${HTTP_AUTH.bearerScheme} ${token}` }
    })
  );
};
