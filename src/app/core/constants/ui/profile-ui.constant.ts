/** Textos propios de la vista de perfil (campos compartidos con otros formularios salen de sus constantes). */
export const PROFILE_PAGE_UI = {
  cardTitle: 'Mi perfil',
  cardSubtitle:
    'Los datos se cargan desde el servidor. El sexo y la fecha de nacimiento no se pueden cambiar tras el registro. Puedes editar altura y dientes; las condiciones médicas tienen su propio guardado.',
  emailLabel: 'Correo de la cuenta',
  emailUnavailable: 'No indicado por el servicio',
  sectionReadOnlyProfile: 'Datos del perfil (solo lectura)',
  sectionEditableProfile: 'Datos que puedes actualizar',
  profileNotEditableHint:
    'Tras el registro, el sexo y la fecha de nacimiento no se modifican por esta pantalla. Si necesitas corregirlos, contacta con soporte o usa el flujo que defina tu institución.',
  birthDateUnavailable: 'No indicada',
  loadingAriaLabel: 'Cargando datos del perfil',
  saveProfile: 'Guardar cambios de altura y dientes',
  saveProfilePending: 'Guardando perfil…',
  saveMedical: 'Guardar condiciones médicas',
  saveMedicalPending: 'Guardando condiciones médicas…',
  reload: 'Recargar datos'
} as const;
