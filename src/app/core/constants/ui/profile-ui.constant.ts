/** Textos propios de la vista de perfil (campos compartidos con otros formularios salen de sus constantes). */
export const PROFILE_PAGE_UI = {
  cardTitle: 'Mi perfil',
  cardSubtitle:
    'Aquí ves lo que tenemos asociado a tu cuenta. El sexo y la fecha de nacimiento no se pueden cambiar tras el registro. Puedes actualizar altura y dientes; las condiciones médicas se guardan por separado.',
  emailLabel: 'Correo de la cuenta',
  emailUnavailable: 'No disponible',
  sectionReadOnlyProfile: 'Datos del perfil (solo lectura)',
  sectionEditableProfile: 'Datos que puedes actualizar',
  profileNotEditableHint:
    'Tras el registro, el sexo y la fecha de nacimiento no se pueden corregir aquí. Si necesitas un cambio, contacta con soporte o sigue el procedimiento de tu institución.',
  birthDateUnavailable: 'No indicada',
  loadingAriaLabel: 'Cargando datos del perfil',
  saveProfile: 'Guardar cambios de altura y dientes',
  saveProfilePending: 'Guardando perfil…',
  saveMedical: 'Guardar condiciones médicas',
  saveMedicalPending: 'Guardando condiciones médicas…',
  reload: 'Recargar datos'
} as const;
