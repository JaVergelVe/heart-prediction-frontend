import {
  PREDICTION_TRISTATE_FORM,
  PredictionTristateFormValue
} from '../constants/data/prediction-survey-options.constant';
import { GeneralHealth, SmokerStatus, EcigaretteUsage } from '../models/prediction-api.model';
import {
  PredictionSimulateRequestBody,
  PredictionSimulationNormalizedState,
  PredictionSimulationViewModel
} from '../models/prediction-simulation.model';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../models/prediction-response.model';
function surveyTriStateToBool(v: PredictionTristateFormValue): boolean | null {
  if (v === PREDICTION_TRISTATE_FORM.unset) {
    return null;
  }
  return v === PREDICTION_TRISTATE_FORM.yes;
}

function optionalNumber(v: number | null | undefined): number | null {
  if (v === null || v === undefined || Number.isNaN(Number(v))) {
    return null;
  }
  return Number(v);
}

function emptyToNullString(v: string): string | null {
  const t = v?.trim();
  return t ? t : null;
}

export function boolToSurveyTriState(v: boolean | null | undefined): PredictionTristateFormValue {
  if (v === true) {
    return PREDICTION_TRISTATE_FORM.yes;
  }
  if (v === false) {
    return PREDICTION_TRISTATE_FORM.no;
  }
  return PREDICTION_TRISTATE_FORM.unset;
}

/** Valores crudos del `FormGroup` de simulación (solo campos editables). */
export type SimulationFormRawValue = {
  weight_kilograms: number | null;
  general_health: string;
  physical_health_days: number | null;
  mental_health_days: number | null;
  physical_activities: PredictionTristateFormValue;
  sleep_hours: number | null;
  smoker_status: string;
  ecigarette_usage: string;
  alcohol_drinkers: PredictionTristateFormValue;
};

export function normalizedStateFromDetailResult(r: PredictionResultData): PredictionSimulationNormalizedState {
  return {
    weight_kilograms: r.weight_kilograms,
    general_health: r.general_health ?? null,
    physical_health_days: r.physical_health_days ?? null,
    mental_health_days: r.mental_health_days ?? null,
    physical_activities: r.physical_activities ?? null,
    sleep_hours: r.sleep_hours ?? null,
    smoker_status: r.smoker_status ?? null,
    ecigarette_usage: r.ecigarette_usage ?? null,
    alcohol_drinkers: r.alcohol_drinkers ?? null
  };
}

export function normalizedStateFromSimulationForm(raw: SimulationFormRawValue): PredictionSimulationNormalizedState {
  const w = optionalNumber(raw.weight_kilograms);
  return {
    weight_kilograms: w ?? 0,
    general_health: emptyToNullString(raw.general_health),
    physical_health_days: optionalNumber(raw.physical_health_days),
    mental_health_days: optionalNumber(raw.mental_health_days),
    physical_activities: surveyTriStateToBool(raw.physical_activities),
    sleep_hours: optionalNumber(raw.sleep_hours),
    smoker_status: emptyToNullString(raw.smoker_status),
    ecigarette_usage: emptyToNullString(raw.ecigarette_usage),
    alcohol_drinkers: surveyTriStateToBool(raw.alcohol_drinkers)
  };
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || b === null || a === undefined || b === undefined) {
    return (a === null || a === undefined) && (b === null || b === undefined);
  }
  return false;
}

const SIM_KEYS = [
  'weight_kilograms',
  'general_health',
  'physical_health_days',
  'mental_health_days',
  'physical_activities',
  'sleep_hours',
  'smoker_status',
  'ecigarette_usage',
  'alcohol_drinkers'
] as const;

export function listSimulationFieldChanges(
  baseline: PredictionSimulationNormalizedState,
  next: PredictionSimulationNormalizedState
): readonly (typeof SIM_KEYS)[number][] {
  const out: (typeof SIM_KEYS)[number][] = [];
  for (const k of SIM_KEYS) {
    if (!valuesEqual(baseline[k], next[k])) {
      out.push(k);
    }
  }
  return out;
}

export function buildSimulationRequestBody(
  baseline: PredictionSimulationNormalizedState,
  next: PredictionSimulationNormalizedState
): PredictionSimulateRequestBody {
  const changed = new Set(listSimulationFieldChanges(baseline, next));
  const body: PredictionSimulateRequestBody = {};
  if (changed.has('weight_kilograms')) {
    body.weight_kilograms = next.weight_kilograms;
  }
  if (changed.has('general_health')) {
    body.general_health = (next.general_health ?? null) as GeneralHealth | null;
  }
  if (changed.has('physical_health_days')) {
    body.physical_health_days = next.physical_health_days;
  }
  if (changed.has('mental_health_days')) {
    body.mental_health_days = next.mental_health_days;
  }
  if (changed.has('physical_activities')) {
    body.physical_activities = next.physical_activities;
  }
  if (changed.has('sleep_hours')) {
    body.sleep_hours = next.sleep_hours;
  }
  if (changed.has('smoker_status')) {
    body.smoker_status = (next.smoker_status ?? null) as SmokerStatus | null;
  }
  if (changed.has('ecigarette_usage')) {
    body.ecigarette_usage = (next.ecigarette_usage ?? null) as EcigaretteUsage | null;
  }
  if (changed.has('alcohol_drinkers')) {
    body.alcohol_drinkers = next.alcohol_drinkers;
  }
  return body;
}

function pickShapExplanation(sim: PredictionResultData): ShapExplanation | null {
  const e = sim.shap_explanation;
  if (!e || typeof e !== 'object') {
    return null;
  }
  if (e.feature_name || e.message || e.impact_score != null || e.direction) {
    return e;
  }
  return null;
}

function pickShapFactors(sim: PredictionResultData): readonly ShapTopFactor[] {
  const f = sim.shap_top_factors;
  return Array.isArray(f) ? f : [];
}

export function mergeSimulationViewModel(args: {
  simulated: PredictionResultData;
  baselineResult: PredictionResultData;
  clientChangedKeys: readonly string[];
  serverOriginalProbability?: number;
  serverOriginalRiskLevel?: string;
  serverChangedFields?: string[];
  serverProbabilityDifference?: number;
}): PredictionSimulationViewModel {
  const originalProbability = args.serverOriginalProbability ?? args.baselineResult.prediction_probability;
  const originalRiskLevel = args.serverOriginalRiskLevel ?? args.baselineResult.risk_level;
  const simulatedProbability = args.simulated.prediction_probability;
  const simulatedRiskLevel = args.simulated.risk_level;
  const probabilityDifference =
    args.serverProbabilityDifference ?? simulatedProbability - originalProbability;

  const changedFieldKeys =
    args.serverChangedFields && args.serverChangedFields.length > 0
      ? args.serverChangedFields
      : args.clientChangedKeys;

  return {
    simulated: args.simulated,
    originalProbability,
    simulatedProbability,
    originalRiskLevel,
    simulatedRiskLevel,
    probabilityDifference,
    changedFieldKeys,
    shapExplanation: pickShapExplanation(args.simulated),
    shapFactors: pickShapFactors(args.simulated),
    recommendations: args.simulated.recommendations ?? []
  };
}
