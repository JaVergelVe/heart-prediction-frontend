import { APP_ROUTE_URLS } from '../route-urls.constant';
import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Textos del formulario de registro (excluye literales del API en selects/checkbox de datos). */
export const REGISTER_PAGE_UI = {
  pageEyebrow: 'Registro seguro',
  cardTitle: 'Crear cuenta',
  cardSubtitle:
    'Los datos de salud deben responder con sinceridad y coincidir con las mismas opciones que verás en el cuestionario de predicción.',
  sections: {
    account: 'Cuenta',
    profile: 'Perfil',
    medical: 'Condiciones médicas y discapacidad'
  },
  sectionDescriptions: {
    account: 'Correo y contraseña para acceder a tu historial y predicciones con cuenta.',
    profile: 'Datos basales que el modelo usa junto con tu peso y el cuestionario de salud.',
    medical: 'Antecedentes y limitaciones funcionales: marca Sí o No en cada casilla.'
  },
  medicalCheckboxGroupCaption: 'Condiciones y limitaciones (casillas)',
  labels: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    sexApi: 'Sexo biológico',
    birthDate: 'Fecha de nacimiento',
    heightMeters: 'Altura (metros)',
    removedTeeth: 'Dientes extraídos',
    diabetes: 'Diabetes'
  },
  hints: {
    passwordMin: `Mínimo ${L.passwordMinRegister} caracteres`,
    heightRange: 'Entre 0,5 y 2,5'
  },
  medicalSectionHint:
    'Marca Sí o No según tu situación actual. Si no estás seguro, elige la opción más cercana a la realidad.',
  medicalLabels: {
    hadAngina: '¿Angina?',
    hadStroke: '¿Accidente cerebrovascular?',
    hadAsthma: '¿Asma?',
    hadCopd: '¿EPOC?',
    hadSkinCancer: '¿Cáncer de piel?',
    hadDepressiveDisorder: '¿Trastorno depresivo?',
    hadKidneyDisease: '¿Enfermedad renal?',
    hadArthritis: '¿Artritis?',
    deafOrHardOfHearing: '¿Sordera o dificultad auditiva?',
    blindOrVisionDifficulty: '¿Ceguera o dificultad visual?',
    difficultyConcentrating: '¿Dificultad para concentrarse?',
    difficultyWalking: '¿Dificultad para caminar?',
    difficultyDressingBathing: '¿Dificultad para vestirse o bañarse?',
    difficultyErrands: '¿Dificultad para hacer recados?'
  },
  submitIdle: 'Registrarse',
  submitPending: 'Registrando…',
  loginPrompt: '¿Ya tienes cuenta?',
  loginLink: 'Iniciar sesión',
  loginRoute: APP_ROUTE_URLS.authLogin
} as const;
