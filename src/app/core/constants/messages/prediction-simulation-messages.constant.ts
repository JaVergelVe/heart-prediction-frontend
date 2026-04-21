/** Mensajes de error e información del flujo de simulación. */
export const PREDICTION_SIMULATION_MESSAGES = {
  noChanges: 'Cambia al menos un valor respecto a lo que ves en el detalle antes de calcular la simulación.',
  invalidResponse: 'No pudimos interpretar la respuesta de la simulación. Recarga la página e inténtalo de nuevo.',
  loadBaselineFirst: 'Espera a que se cargue el detalle de la predicción antes de simular.'
} as const;
