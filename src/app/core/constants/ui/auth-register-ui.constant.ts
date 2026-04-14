import { APP_ROUTE_URLS } from '../route-urls.constant';
import { VALIDATION_LIMITS } from '../validation-limits.constant';

const L = VALIDATION_LIMITS;

/** Textos del formulario de registro (excluye literales del API en selects/checkbox de datos). */
export const REGISTER_PAGE_UI = {
  cardTitle: 'Crear cuenta',
  cardSubtitle: 'Los valores de salud deben coincidir con las opciones del cuestionario del API',
  sections: {
    account: 'Cuenta',
    profile: 'Perfil',
    medical: 'Condiciones médicas y discapacidad'
  },
  labels: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    sexApi: 'Sexo (valor enviado al API)',
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
    'Marca Sí o No según corresponda. Los valores se envían como booleanos al API.',
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
