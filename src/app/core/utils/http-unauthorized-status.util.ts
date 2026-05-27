import { HttpErrorResponse } from '@angular/common/http';

/** Respuesta HTTP 401 (sesión ausente o token rechazado por el API). */
export function isUnauthorizedHttpError(err: unknown): err is HttpErrorResponse {
  return err instanceof HttpErrorResponse && err.status === 401;
}
