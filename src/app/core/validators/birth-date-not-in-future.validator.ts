import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Error cuando la fecha es posterior a hoy. */
export const BIRTH_DATE_FUTURE_ERROR_KEY = 'birthDateFuture' as const;

/** Error cuando el valor no es una fecha válida. */
export const BIRTH_DATE_INVALID_ERROR_KEY = 'birthDateInvalid' as const;
/** Error cuando la fecha corresponde a una persona menor de edad. */
export const BIRTH_DATE_UNDERAGE_ERROR_KEY = 'birthDateUnderage' as const;

/**
 * Valida que el control tenga un `Date` no posterior al día actual (zona horaria local).
 * Vacío/null delega en `Validators.required` u otros.
 */
export function birthDateNotInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') {
      return null;
    }
    if (!(v instanceof Date)) {
      return { [BIRTH_DATE_INVALID_ERROR_KEY]: true };
    }
    if (Number.isNaN(v.getTime())) {
      return { [BIRTH_DATE_INVALID_ERROR_KEY]: true };
    }
    const limit = new Date();
    limit.setHours(23, 59, 59, 999);
    if (v.getTime() > limit.getTime()) {
      return { [BIRTH_DATE_FUTURE_ERROR_KEY]: true };
    }
    return null;
  };
}

/**
 * Valida mayoría de edad mínima (18 años por defecto) usando fecha calendario local.
 * Vacío/null delega en `Validators.required` u otros.
 */
export function birthDateMinimumAgeValidator(minAge = 18): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') {
      return null;
    }
    if (!(v instanceof Date) || Number.isNaN(v.getTime())) {
      return null;
    }

    const today = new Date();
    const adultThreshold = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    if (v.getTime() > adultThreshold.getTime()) {
      return { [BIRTH_DATE_UNDERAGE_ERROR_KEY]: true };
    }
    return null;
  };
}
