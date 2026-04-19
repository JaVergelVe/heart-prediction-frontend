import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../models/prediction-response.model';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object';
}

function readFlexibleNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) {
      return n;
    }
  }
  return undefined;
}

function readFlexibleString(v: unknown): string | undefined {
  if (typeof v === 'string') {
    return v;
  }
  return undefined;
}

function looksLikeResultPayload(v: unknown): v is PredictionResultData {
  if (!isRecord(v)) {
    return false;
  }
  return (
    typeof v['prediction_id'] === 'string' &&
    typeof v['prediction_probability'] === 'number' &&
    typeof v['risk_level'] === 'string' &&
    typeof v['weight_kilograms'] === 'number'
  );
}

function readNumberField(obj: Record<string, unknown>, key: string): number | undefined {
  return readFlexibleNumber(obj[key]);
}

function readStringField(obj: Record<string, unknown>, key: string): string | undefined {
  return readFlexibleString(obj[key]);
}

function readStringArray(obj: Record<string, unknown>, key: string): string[] | undefined {
  const x = obj[key];
  if (!Array.isArray(x)) {
    return undefined;
  }
  const out = x.filter((i): i is string => typeof i === 'string');
  return out.length > 0 ? out : undefined;
}

/** Respuesta real del backend (`prediction_service.simulate_what_if`): sin `prediction_id` en raíz. */
function isBackendWhatIfPayload(data: unknown): boolean {
  if (!isRecord(data)) {
    return false;
  }
  if (typeof data['prediction_id'] === 'string') {
    return false;
  }
  return (
    readFlexibleNumber(data['simulated_probability']) != null &&
    readFlexibleNumber(data['original_probability']) != null &&
    isRecord(data['changed_fields'])
  );
}

const PATCH_KEYS = new Set([
  'weight_kilograms',
  'general_health',
  'physical_health_days',
  'mental_health_days',
  'physical_activities',
  'sleep_hours',
  'smoker_status',
  'ecigarette_usage',
  'alcohol_drinkers'
]);

function applyChangedFieldsToBaseline(
  baseline: PredictionResultData,
  changedFields: Record<string, unknown>
): PredictionResultData {
  const out: PredictionResultData = { ...baseline };
  for (const [key, entry] of Object.entries(changedFields)) {
    if (!PATCH_KEYS.has(key) || !isRecord(entry)) {
      continue;
    }
    const sim = entry['simulated'];
    if (key === 'weight_kilograms') {
      const n = readFlexibleNumber(sim);
      if (n != null) {
        out.weight_kilograms = n;
      }
      continue;
    }
    if (key === 'sleep_hours' || key === 'physical_health_days' || key === 'mental_health_days') {
      const n = readFlexibleNumber(sim);
      if (n != null) {
        (out as unknown as Record<string, unknown>)[key] = n;
      }
      continue;
    }
    if (key === 'physical_activities' || key === 'alcohol_drinkers') {
      if (typeof sim === 'boolean') {
        (out as unknown as Record<string, unknown>)[key] = sim;
      }
      continue;
    }
    if (key === 'general_health' || key === 'smoker_status' || key === 'ecigarette_usage') {
      if (typeof sim === 'string') {
        (out as unknown as Record<string, unknown>)[key] = sim;
      }
    }
  }
  return out;
}

function normalizeShapExplanation(v: unknown): ShapExplanation | null {
  if (!v || typeof v !== 'object') {
    return null;
  }
  const e = v as ShapExplanation;
  if (e.feature_name || e.message || e.impact_score != null || e.direction) {
    return e;
  }
  return null;
}

function normalizeShapTopFactors(v: unknown): ShapTopFactor[] | null {
  if (!Array.isArray(v)) {
    return null;
  }
  return v as ShapTopFactor[];
}

function buildSyntheticFromBackendWhatIf(
  baseline: PredictionResultData,
  data: Record<string, unknown>
): PredictionResultData {
  const simProb = readFlexibleNumber(data['simulated_probability']);
  const simRisk = readFlexibleString(data['simulated_risk_level']) ?? '';
  const changedRaw = isRecord(data['changed_fields']) ? data['changed_fields'] : {};
  const merged = applyChangedFieldsToBaseline(baseline, changedRaw);
  const recRaw = data['recommendations'];
  const recommendations = Array.isArray(recRaw)
    ? recRaw.filter((x): x is string => typeof x === 'string')
    : [];

  return {
    ...merged,
    prediction_probability: simProb ?? merged.prediction_probability,
    risk_level: simRisk,
    shap_explanation: normalizeShapExplanation(data['shap_explanation']),
    shap_top_factors: normalizeShapTopFactors(data['shap_top_factors']),
    recommendations
  };
}

export type ParsedSimulateResponse = {
  simulated: PredictionResultData;
  serverOriginalProbability?: number;
  serverOriginalRiskLevel?: string;
  serverChangedFields?: string[];
  serverProbabilityDifference?: number;
};

/**
 * Interpreta la respuesta HTTP del endpoint de simulación.
 * - Forma backend actual: `data` con original/simulated probability, risk, changed_fields (objeto), SHAP.
 * - Compatibilidad: `data` como `PredictionResultData` o `data.simulated` como resultado completo.
 */
export function parsePredictionSimulateResponse(raw: unknown, baseline: PredictionResultData): ParsedSimulateResponse {
  if (!isRecord(raw) || !('data' in raw)) {
    throw new Error('simulate_missing_data');
  }
  const data = raw['data'];

  if (looksLikeResultPayload(data)) {
    const ext = data as unknown as Record<string, unknown>;
    return {
      simulated: data,
      serverOriginalProbability: readNumberField(ext, 'original_prediction_probability'),
      serverOriginalRiskLevel: readStringField(ext, 'original_risk_level'),
      serverChangedFields: readStringArray(ext, 'changed_fields'),
      serverProbabilityDifference:
        readNumberField(ext, 'probability_difference') ?? readNumberField(ext, 'probability_delta')
    };
  }

  if (isRecord(data) && looksLikeResultPayload(data['simulated'])) {
    const wrap = data;
    const sim = wrap['simulated'] as PredictionResultData;
    return {
      simulated: sim,
      serverOriginalProbability: readNumberField(wrap, 'original_prediction_probability'),
      serverOriginalRiskLevel: readStringField(wrap, 'original_risk_level'),
      serverChangedFields: readStringArray(wrap, 'changed_fields'),
      serverProbabilityDifference:
        readNumberField(wrap, 'probability_difference') ?? readNumberField(wrap, 'probability_delta')
    };
  }

  if (isRecord(data) && isBackendWhatIfPayload(data)) {
    const simulated = buildSyntheticFromBackendWhatIf(baseline, data);
    const changed = isRecord(data['changed_fields']) ? data['changed_fields'] : {};
    return {
      simulated,
      serverOriginalProbability: readFlexibleNumber(data['original_probability']),
      serverOriginalRiskLevel: readFlexibleString(data['original_risk_level']),
      serverChangedFields: Object.keys(changed),
      serverProbabilityDifference: readFlexibleNumber(data['probability_difference'])
    };
  }

  throw new Error('simulate_unrecognized_shape');
}
