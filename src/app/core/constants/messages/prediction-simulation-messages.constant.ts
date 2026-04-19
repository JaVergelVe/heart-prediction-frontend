/** Mensajes de error e información del flujo de simulación. */
export const PREDICTION_SIMULATION_MESSAGES = {
  noChanges: 'Modifica al menos un valor respecto al detalle cargado antes de simular.',
  invalidResponse: 'La respuesta del servicio de simulación no tiene el formato esperado.',
  loadBaselineFirst: 'Espera a que se cargue el detalle de la predicción antes de simular.'
} as const;
