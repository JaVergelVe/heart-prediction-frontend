/** Mensajes de error y vacíos del historial autenticado. */
export const HISTORY_MESSAGES = {
  loadListError: 'No se pudo cargar el historial. Revisa la conexión o inténtalo más tarde.',
  loadDetailError: 'No se pudo cargar el detalle de esta predicción.',
  emptyList: 'Aún no hay predicciones guardadas en tu cuenta.',
  pdfDownloadEmpty: 'El servidor devolvió un archivo PDF vacío.',
  pdfDownloadNotPdf: 'El servidor no devolvió un PDF válido.'
} as const;
