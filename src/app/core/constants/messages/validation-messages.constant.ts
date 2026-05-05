import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Mensajes de validación reutilizables en formularios. */
export const VALIDATION_MESSAGES = {
  emailRequired: 'El correo es obligatorio',
  emailInvalid: 'Introduce un correo válido',
  passwordRequired: 'La contraseña es obligatoria',
  passwordEmpty: 'La contraseña no puede estar vacía',
  passwordMinLogin: `Al menos ${L.passwordMinLogin} caracteres`,
  passwordMinRegister: `Al menos ${L.passwordMinRegister} caracteres`,
  passwordMax: `Máximo ${L.passwordMax} caracteres`,
  selectRequired: 'Selecciona una opción',
  birthDateRequired: 'La fecha es obligatoria',
  birthDateFuture: 'La fecha de nacimiento no puede ser posterior a hoy',
  birthDateInvalid: 'Introduce una fecha de nacimiento válida',
  birthDateUnderage: 'Debes tener al menos 18 años para registrarte',
  heightRequired: 'La altura es obligatoria',
  heightMin: `Mínimo ${L.heightMetersMin} m`,
  heightMax: `Máximo ${L.heightMetersMax} m`,
  weightRequired: 'El peso es obligatorio',
  weightMin: `Mínimo ${L.weightKgMin} kg`,
  weightMax: `Máximo ${L.weightKgMax} kg`,
  healthDaysMin: `Mínimo ${L.healthDaysMin} días`,
  healthDaysMax: `Máximo ${L.healthDaysMax} días`,
  sleepHoursMin: `Mínimo ${L.sleepHoursMin} h`,
  sleepHoursMax: `Máximo ${L.sleepHoursMax} h`
} as const;
