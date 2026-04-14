import { HttpErrorResponse } from '@angular/common/http';
import { HTTP_ERROR_MESSAGES } from '../../../core/constants/messages/http-error-messages.constant';

/** Mensaje legible a partir de respuestas de error típicas de FastAPI (`detail`). */
export function formatAuthHttpError(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) {
    return HTTP_ERROR_MESSAGES.generic;
  }
  if (err.status === 0) {
    return HTTP_ERROR_MESSAGES.offline;
  }
  const detail = err.error?.detail;
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail
      .map((d: { msg?: string }) => d?.msg)
      .filter((m): m is string => !!m)
      .join(' ');
  }
  return err.error?.message ?? `${HTTP_ERROR_MESSAGES.statusPrefix} ${err.status}`;
}
