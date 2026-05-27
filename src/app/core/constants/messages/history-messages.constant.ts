/** Mensajes de error y vacíos del historial autenticado. */
export const HISTORY_MESSAGES = {
  loadListError: 'No se pudo cargar el historial. Revisa la conexión o inténtalo más tarde.',
  loadDetailError: 'No se pudo cargar el detalle de esta predicción.',
  emptyList: 'Aún no hay predicciones guardadas en tu cuenta.',
  pdfDownloadEmpty: 'No se recibió el informe en PDF. Inténtalo de nuevo en unos momentos.',
  pdfDownloadNotPdf: 'El informe no llegó como PDF válido. Inténtalo de nuevo o contacta con soporte si se repite.'
} as const;
