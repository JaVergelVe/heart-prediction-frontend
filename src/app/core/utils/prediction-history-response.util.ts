import {
  PredictionHistoryListData,
  PredictionHistoryListEnvelope,
  PredictionResultData
} from '../models/prediction-response.model';

/** Normaliza distintas formas de envoltorio del listado de historial. */
export function extractHistoryItemsFromEnvelope(body: PredictionHistoryListEnvelope): PredictionResultData[] {
  const raw = body.data;
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === 'object') {
    const o = raw as PredictionHistoryListData;
    if (Array.isArray(o.items)) {
      return o.items;
    }
    if (Array.isArray(o.predictions)) {
      return o.predictions;
    }
  }
  return [];
}
