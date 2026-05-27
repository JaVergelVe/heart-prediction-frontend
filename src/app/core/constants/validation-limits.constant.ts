/** Límites numéricos alineados con validadores de formularios. */
export const VALIDATION_LIMITS = {
  passwordMinLogin: 1,
  passwordMinRegister: 8,
  passwordMax: 128,
  heightMetersMin: 0.5,
  heightMetersMax: 2.5,
  weightKgMin: 20,
  weightKgMax: 300,
  healthDaysMin: 0,
  healthDaysMax: 30,
  sleepHoursMin: 0,
  sleepHoursMax: 24
} as const;
