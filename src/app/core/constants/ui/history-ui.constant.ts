import { APP_ROUTE_URLS } from '../route-urls.constant';

/** Claves de columnas de la tabla de historial (coinciden con `matColumnDef`). */
export const HISTORY_LIST_COLUMN_KEYS = {
  date: 'date',
  risk: 'risk',
  probability: 'probability',
  bmi: 'bmi',
  actions: 'actions'
} as const;

export const HISTORY_LIST_DISPLAYED_COLUMNS: readonly string[] = [
  HISTORY_LIST_COLUMN_KEYS.date,
  HISTORY_LIST_COLUMN_KEYS.risk,
  HISTORY_LIST_COLUMN_KEYS.probability,
  HISTORY_LIST_COLUMN_KEYS.bmi,
  HISTORY_LIST_COLUMN_KEYS.actions
];

/** Textos de la vista de listado de historial (protegida). */
export const HISTORY_LIST_PAGE_UI = {
  cardTitle: 'Historial de predicciones',
  cardSubtitle: 'Predicciones guardadas en tu cuenta. Pulsa «Ver detalle» para ver el análisis completo.',
  loadingAriaLabel: 'Cargando historial de predicciones',
  retry: 'Reintentar',
  viewDetail: 'Ver detalle',
  viewDetailAria: 'Abrir detalle de la predicción',
  columnHeaders: {
    date: 'Fecha',
    risk: 'Nivel de riesgo',
    probability: 'Probabilidad',
    bmi: 'IMC'
  },
  probabilitySuffix: '%',
  bmiUnavailable: '—'
} as const;

/** Textos de la vista de detalle desde el historial. */
export const HISTORY_DETAIL_PAGE_UI = {
  cardTitle: 'Detalle de predicción',
  cardSubtitle: 'Información guardada de esta predicción en tu cuenta.',
  loadingAriaLabel: 'Cargando detalle de la predicción',
  backToHistory: 'Volver al historial',
  backToHistoryRoute: APP_ROUTE_URLS.history,
  retry: 'Reintentar',
  pdfDownload: 'Descargar informe PDF',
  pdfDownloadAriaLabel: 'Descargar informe de predicción en formato PDF',
  pdfDownloadPending: 'Generando PDF…',
  pdfDownloadLoadingAriaLabel: 'Descargando informe PDF'
} as const;
