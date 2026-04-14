import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Mensajes de validación reutilizables en formularios. */
export const VALIDATION_MESSAGES = {
  emailRequired: 'El correo es obligatorio',
  emailInvalid: 'Introduce un correo válido',
  passwordRequired: 'La contraseña es obligatoria',
  passwordEmpty: 'La contraseña no puede estar vacía',
  passwordMinRegister: `Al menos ${L.passwordMinRegister} caracteres`,
  passwordMax: `Máximo ${L.passwordMax} caracteres`,
  selectRequired: 'Selecciona una opción',
  birthDateRequired: 'La fecha es obligatoria',
  heightRequired: 'La altura es obligatoria',
  heightMin: `Mínimo ${L.heightMetersMin} m`,
  heightMax: `Máximo ${L.heightMetersMax} m`
} as const;
