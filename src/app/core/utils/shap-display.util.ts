import {
  SHAP_AGE_CATEGORY_SUFFIX_LABELS,
  SHAP_BMI_ELEVATED_THRESHOLD,
  SHAP_BOOLEAN_VALUE_LABELS,
  SHAP_COMPOUND_CATEGORY_PREFIX,
  SHAP_COMPOUND_VALUE_LABELS,
  SHAP_DIRECTION_TO_KIND,
  SHAP_DISPLAY_UI,
  SHAP_FEATURE_TITLE_MAP,
  SHAP_INTENSITY_RELATIVE_THRESHOLDS
} from '../constants/shap-display.constant';
import type { ShapExplanation, ShapTopFactor } from '../models/prediction-response.model';

export type ShapImpactKind = 'increase' | 'decrease' | 'neutral' | 'unknown';

export interface ShapFeatureIdentity {
  baseKey: string;
  suffix: string | null;
  numericValue: number | null;
  isTruthy: boolean | null;
}

export interface ShapFactorUserView {
  friendlyTitle: string;
  impactKind: ShapImpactKind;
  impactLabel: string;
  intensityLabel: string | null;
  primaryExplanation: string;
  narrativeExtra: string | null;
  hasTechnicalPanel: boolean;
  technicalRows: { label: string; value: string }[];
}

export interface ShapExplanationUserView {
  friendlyTitle: string;
  impactKind: ShapImpactKind;
  impactLabel: string;
  primaryExplanation: string;
  narrativeExtra: string | null;
  hasTechnicalPanel: boolean;
  technicalRows: { label: string; value: string }[];
}

const HAD_MEDICAL_PREFIX = 'had';

const BOOLEAN_HEALTH_FEATURES = new Set([
  'physicalactivities',
  'alcoholdrinkers',
  'chestscan',
  'hivtesting',
  'fluvaxlast12',
  'pneumovaxever',
  'highrisklastyear',
  'deaforhardofhearing',
  'blindorvisiondifficulty',
  'difficultyconcentrating',
  'difficultywalking',
  'difficultydressingbathing',
  'difficultyerrands'
]);

const TRUTHY_SUFFIXES = new Set(['true', '1', 'yes', 'si', 'sí']);
const FALSY_SUFFIXES = new Set(['false', '0', 'no']);

export function normalizeShapToken(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
}

function camelToSnakeKey(s: string): string {
  const t = s.trim().replace(/[\s-]+/g, '_');
  return t
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/-+/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
}

function titleFromExactOrSnake(raw: string): string | null {
  const n = normalizeShapToken(raw);
  if (SHAP_FEATURE_TITLE_MAP[n]) {
    return SHAP_FEATURE_TITLE_MAP[n];
  }
  const snake = camelToSnakeKey(raw);
  return SHAP_FEATURE_TITLE_MAP[snake] ?? null;
}

function parseNumericSuffix(suffix: string): number | null {
  const n = Number(suffix.replace(/_/g, '.'));
  return Number.isFinite(n) ? n : null;
}

function resolveBooleanFromSuffix(suffix: string | null): boolean | null {
  if (suffix == null) {
    return null;
  }
  const s = normalizeShapToken(suffix);
  if (TRUTHY_SUFFIXES.has(s)) {
    return true;
  }
  if (FALSY_SUFFIXES.has(s)) {
    return false;
  }
  return null;
}

function resolveBooleanFromValue(value: number | null | undefined): boolean | null {
  if (value == null || Number.isNaN(Number(value))) {
    return null;
  }
  const n = Number(value);
  if (n === 1) {
    return true;
  }
  if (n === 0) {
    return false;
  }
  return null;
}

export function parseShapFeatureIdentity(
  featureName: string | undefined | null,
  featureValue?: number | null
): ShapFeatureIdentity {
  const normalized = normalizeShapToken(featureName ?? '');
  const valueFromField =
    featureValue != null && !Number.isNaN(Number(featureValue)) ? Number(featureValue) : null;

  const keys = Object.keys(SHAP_COMPOUND_CATEGORY_PREFIX).sort((a, b) => b.length - a.length);
  for (const cat of keys) {
    if (normalized === cat) {
      return {
        baseKey: cat,
        suffix: null,
        numericValue: valueFromField,
        isTruthy: resolveBooleanFromValue(valueFromField)
      };
    }
    const prefix = `${cat}_`;
    if (normalized.startsWith(prefix)) {
      const suffix = normalized.slice(prefix.length);
      const suffixBool = resolveBooleanFromSuffix(suffix);
      const valueBool = resolveBooleanFromValue(valueFromField);
      return {
        baseKey: cat,
        suffix: suffix || null,
        numericValue: valueFromField ?? parseNumericSuffix(suffix),
        isTruthy: suffixBool ?? valueBool
      };
    }
  }

  const exactKey = normalizeShapToken(featureName ?? '');
  return {
    baseKey: exactKey,
    suffix: null,
    numericValue: valueFromField,
    isTruthy: resolveBooleanFromValue(valueFromField)
  };
}

function isHadMedicalFeature(baseKey: string): boolean {
  return baseKey.startsWith(HAD_MEDICAL_PREFIX) && baseKey !== 'haddiabetes';
}

function medicalConditionPhrase(baseKey: string): string | null {
  const title = SHAP_FEATURE_TITLE_MAP[baseKey];
  if (!title) {
    return null;
  }
  const lower = title.toLowerCase();
  if (lower.startsWith('antecedentes de ')) {
    return lower.slice('antecedentes de '.length);
  }
  return null;
}

function suffixImpliesNonSmoker(suffix: string | null): boolean {
  if (!suffix) {
    return false;
  }
  const s = normalizeShapToken(suffix);
  return (
    s.includes('never') ||
    s.includes('nunca') ||
    s.includes('former') ||
    s.includes('exfum') ||
    s === 'no'
  );
}

function suffixImpliesCurrentSmoker(suffix: string | null): boolean {
  if (!suffix) {
    return false;
  }
  const s = normalizeShapToken(suffix);
  return s.includes('current') || s.includes('actual') || s.includes('every_day') || s.includes('some_days');
}

function ageGroupDetailLabel(suffix: string | null): string | null {
  if (!suffix) {
    return null;
  }
  return SHAP_AGE_CATEGORY_SUFFIX_LABELS[suffix] ?? SHAP_AGE_CATEGORY_SUFFIX_LABELS[normalizeShapToken(suffix)];
}

function compoundValueLabel(baseKey: string, suffix: string | null): string | null {
  if (!suffix) {
    return null;
  }
  return SHAP_COMPOUND_VALUE_LABELS[baseKey]?.[suffix] ?? SHAP_COMPOUND_VALUE_LABELS[baseKey]?.[normalizeShapToken(suffix)] ?? null;
}

function narrativeForHadMedical(phrase: string, isTruthy: boolean, kind: ShapImpactKind): string | null {
  if (kind !== 'increase' && kind !== 'decrease') {
    return null;
  }
  if (!isTruthy && kind === 'decrease') {
    return `No presentar antecedentes de ${phrase} contribuyó a reducir el riesgo estimado.`;
  }
  if (isTruthy && kind === 'increase') {
    return `Presentar antecedentes de ${phrase} se asoció con un mayor riesgo estimado.`;
  }
  if (!isTruthy && kind === 'increase') {
    return `No presentar antecedentes de ${phrase} se asoció con un mayor riesgo estimado.`;
  }
  if (isTruthy && kind === 'decrease') {
    return `Presentar antecedentes de ${phrase} contribuyó a reducir el riesgo estimado.`;
  }
  return null;
}

function narrativeForPhysicalActivities(isTruthy: boolean, kind: ShapImpactKind): string | null {
  if (isTruthy && kind === 'decrease') {
    return 'Realizar actividad física contribuyó a reducir el riesgo estimado.';
  }
  if (!isTruthy && kind === 'increase') {
    return 'No reportar actividad física se asoció con un mayor riesgo estimado.';
  }
  if (isTruthy && kind === 'increase') {
    return 'Reportar actividad física se asoció con un mayor riesgo estimado.';
  }
  if (!isTruthy && kind === 'decrease') {
    return 'No reportar actividad física contribuyó a reducir el riesgo estimado.';
  }
  return null;
}

function narrativeForBooleanHealthFeature(baseKey: string, isTruthy: boolean, kind: ShapImpactKind): string | null {
  if (baseKey === 'physicalactivities') {
    return narrativeForPhysicalActivities(isTruthy, kind);
  }
  const title = SHAP_FEATURE_TITLE_MAP[baseKey] ?? SHAP_COMPOUND_CATEGORY_PREFIX[baseKey];
  if (!title) {
    return null;
  }
  const label = title.toLowerCase();
  if (kind === 'increase' && isTruthy) {
    return `Reportar ${label} se asoció con un mayor riesgo estimado.`;
  }
  if (kind === 'decrease' && !isTruthy) {
    return `No reportar ${label} contribuyó a reducir el riesgo estimado.`;
  }
  if (kind === 'increase' && !isTruthy) {
    return `No reportar ${label} se asoció con un mayor riesgo estimado.`;
  }
  if (kind === 'decrease' && isTruthy) {
    return `Reportar ${label} contribuyó a reducir el riesgo estimado.`;
  }
  return null;
}

export function buildContextualShapNarrative(
  identity: ShapFeatureIdentity,
  kind: ShapImpactKind
): { primary: string; detail: string | null } {
  const { baseKey, suffix, numericValue, isTruthy } = identity;

  if (baseKey === 'sleephours') {
    const detail =
      numericValue != null
        ? `En tu registro constan ${formatNumericForDisplay(numericValue)} horas de sueño en promedio.`
        : null;
    return {
      primary: 'La cantidad de horas de sueño registrada tuvo una influencia importante en el riesgo estimado.',
      detail
    };
  }

  if (baseKey === 'agecategory') {
    const ageLabel = ageGroupDetailLabel(suffix);
    const groupPhrase = ageLabel ? ageLabel.replace(/^De /, '').toLowerCase() : 'ese grupo de edad';
    const isInactiveBucket = numericValue === 0 || (numericValue == null && isTruthy === false);
    if (isInactiveBucket) {
      if (kind === 'decrease') {
        return {
          primary: `No pertenecer al grupo de ${groupPhrase} contribuyó a reducir el riesgo estimado.`,
          detail: null
        };
      }
      if (kind === 'increase') {
        return {
          primary: `No pertenecer al grupo de ${groupPhrase} se asoció con un mayor riesgo estimado.`,
          detail: null
        };
      }
    }
    const detail = ageLabel ? `Corresponde al grupo de ${groupPhrase}.` : null;
    if (kind === 'decrease') {
      return {
        primary: 'Tu grupo de edad se asoció con un menor riesgo cardiovascular estimado.',
        detail
      };
    }
    if (kind === 'increase') {
      return {
        primary: 'Tu grupo de edad se asoció con un mayor riesgo cardiovascular estimado.',
        detail
      };
    }
  }

  if (baseKey === 'smokerstatus') {
    if (suffixImpliesNonSmoker(suffix) && kind === 'decrease') {
      const valueLabel = compoundValueLabel(baseKey, suffix);
      return {
        primary: 'El estado de no fumador contribuyó a reducir el riesgo estimado.',
        detail: valueLabel ? `Respuesta registrada: ${valueLabel}.` : null
      };
    }
    if (suffixImpliesCurrentSmoker(suffix) && kind === 'increase') {
      const valueLabel = compoundValueLabel(baseKey, suffix);
      return {
        primary: 'El consumo actual de tabaco se asoció con un mayor riesgo estimado.',
        detail: valueLabel ? `Respuesta registrada: ${valueLabel}.` : null
      };
    }
    if (suffixImpliesNonSmoker(suffix) && kind === 'increase') {
      return {
        primary: 'El perfil de no fumador se asoció con un mayor riesgo estimado en esta estimación.',
        detail: null
      };
    }
    if (suffixImpliesCurrentSmoker(suffix) && kind === 'decrease') {
      return {
        primary: 'El consumo de tabaco registrado contribuyó a reducir el riesgo estimado en este cálculo.',
        detail: null
      };
    }
  }

  if (baseKey === 'bmi' && numericValue != null) {
    if (numericValue >= SHAP_BMI_ELEVATED_THRESHOLD && kind === 'increase') {
      return {
        primary: 'Un IMC elevado se asoció con un mayor riesgo estimado.',
        detail: `IMC registrado: ${formatNumericForDisplay(numericValue)}.`
      };
    }
    if (numericValue < SHAP_BMI_ELEVATED_THRESHOLD && kind === 'decrease') {
      return {
        primary: 'Un IMC en rango no elevado contribuyó a reducir el riesgo estimado.',
        detail: `IMC registrado: ${formatNumericForDisplay(numericValue)}.`
      };
    }
    if (numericValue >= SHAP_BMI_ELEVATED_THRESHOLD && kind === 'decrease') {
      return {
        primary: 'El IMC registrado contribuyó a reducir el riesgo estimado en este cálculo.',
        detail: `IMC registrado: ${formatNumericForDisplay(numericValue)}.`
      };
    }
  }

  if (isTruthy !== null) {
    if (isHadMedicalFeature(baseKey)) {
      const phrase = medicalConditionPhrase(baseKey);
      if (phrase) {
        const specific = narrativeForHadMedical(phrase, isTruthy, kind);
        if (specific) {
          return { primary: specific, detail: null };
        }
      }
    }
    if (BOOLEAN_HEALTH_FEATURES.has(baseKey) || baseKey === 'physicalactivities') {
      const specific = narrativeForBooleanHealthFeature(baseKey, isTruthy, kind);
      if (specific) {
        return { primary: specific, detail: null };
      }
    }
  }

  const compoundLabel = suffix ? compoundValueLabel(baseKey, suffix) : null;
  if (compoundLabel && (kind === 'increase' || kind === 'decrease')) {
    const categoryTitle = SHAP_COMPOUND_CATEGORY_PREFIX[baseKey] ?? SHAP_FEATURE_TITLE_MAP[baseKey];
    if (categoryTitle) {
      const isInactiveBucket = numericValue === 0 || (numericValue == null && isTruthy === false);
      const primary = isInactiveBucket
        ? kind === 'increase'
          ? `No pertenecer a ${categoryTitle.toLowerCase()} (${compoundLabel}) se asoció con un mayor riesgo estimado.`
          : `No pertenecer a ${categoryTitle.toLowerCase()} (${compoundLabel}) contribuyó a reducir el riesgo estimado.`
        : kind === 'increase'
          ? `${categoryTitle} (${compoundLabel}) se asoció con un mayor riesgo estimado.`
          : `${categoryTitle} (${compoundLabel}) se asoció con una reducción del riesgo estimado.`;
      return { primary, detail: null };
    }
  }

  return {
    primary: shapPrimaryExplanation(kind),
    detail: null
  };
}

function formatNumericForDisplay(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

function compoundFriendlyTitle(normalizedFull: string): string | null {
  const keys = Object.keys(SHAP_COMPOUND_CATEGORY_PREFIX).sort((a, b) => b.length - a.length);
  for (const cat of keys) {
    if (normalizedFull === cat) {
      return SHAP_COMPOUND_CATEGORY_PREFIX[cat];
    }
    const prefix = `${cat}_`;
    if (normalizedFull.startsWith(prefix)) {
      const suffix = normalizedFull.slice(prefix.length);
      if (!suffix) {
        return SHAP_COMPOUND_CATEGORY_PREFIX[cat];
      }
      const categoryTitle = SHAP_COMPOUND_CATEGORY_PREFIX[cat];
      const valueTable = SHAP_COMPOUND_VALUE_LABELS[cat];
      if (valueTable?.[suffix]) {
        return `${categoryTitle}: ${valueTable[suffix]}`;
      }
      if (cat === 'agecategory') {
        const ageNorm = normalizeShapToken(suffix);
        const ageLabel = SHAP_AGE_CATEGORY_SUFFIX_LABELS[suffix] ?? SHAP_AGE_CATEGORY_SUFFIX_LABELS[ageNorm];
        if (ageLabel) {
          return `${categoryTitle}: ${ageLabel}`;
        }
      }
      const boolLabel = SHAP_BOOLEAN_VALUE_LABELS[suffix] ?? SHAP_BOOLEAN_VALUE_LABELS[normalizeShapToken(suffix)];
      if (boolLabel) {
        return `${categoryTitle}: ${boolLabel}`;
      }
      const readable = suffix.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      const pretty = readable.replace(/\b\w/g, (c) => c.toUpperCase());
      return `${categoryTitle}: ${pretty}`;
    }
  }
  return null;
}

export function shapFriendlyFeatureTitle(featureName: string | undefined | null): string {
  const raw = featureName?.trim();
  if (!raw) {
    return SHAP_DISPLAY_UI.fallbackUnknownFeature;
  }
  const exact = titleFromExactOrSnake(raw);
  if (exact) {
    return exact;
  }
  const normalized = normalizeShapToken(raw);
  const compound = compoundFriendlyTitle(normalized);
  if (compound) {
    return compound;
  }
  const readable = normalized.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  if (readable.length > 0) {
    return readable.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return SHAP_DISPLAY_UI.fallbackUnknownFeature;
}

export function classifyShapDirection(direction: string | undefined | null): ShapImpactKind {
  if (direction == null || String(direction).trim() === '') {
    return 'unknown';
  }
  const k = normalizeShapToken(String(direction));
  const mapped = SHAP_DIRECTION_TO_KIND[k];
  if (mapped) {
    return mapped === 'neutral' ? 'neutral' : mapped;
  }
  if (k.includes('increase') && k.includes('risk')) {
    return 'increase';
  }
  if (k.includes('decrease') && k.includes('risk')) {
    return 'decrease';
  }
  return 'unknown';
}

export function shapImpactLabel(kind: ShapImpactKind): string {
  switch (kind) {
    case 'increase':
      return SHAP_DISPLAY_UI.impactIncrease;
    case 'decrease':
      return SHAP_DISPLAY_UI.impactDecrease;
    case 'neutral':
      return SHAP_DISPLAY_UI.impactNeutral;
    default:
      return SHAP_DISPLAY_UI.impactUnknown;
  }
}

export function shapPrimaryExplanation(kind: ShapImpactKind): string {
  switch (kind) {
    case 'increase':
      return SHAP_DISPLAY_UI.explanationIncrease;
    case 'decrease':
      return SHAP_DISPLAY_UI.explanationDecrease;
    default:
      return SHAP_DISPLAY_UI.explanationNeutral;
  }
}

export function interpretationLooksTechnical(text: string): boolean {
  const t = text.toLowerCase();
  return SHAP_DISPLAY_UI.technicalInterpretationHints.some((h) => t.includes(h));
}

/**
 * Columnas one-hot inactivas (valor 0) de categorías compuestas no aportan una respuesta del usuario;
 * ocultarlas evita duplicar el mismo atributo (p. ej. dos grupos de edad).
 */
export function isInactiveOneHotShapFactor(factor: ShapTopFactor): boolean {
  const value = factor.feature_value;
  if (value == null || Number.isNaN(Number(value)) || Number(value) !== 0) {
    return false;
  }
  const identity = parseShapFeatureIdentity(factor.feature_name, factor.feature_value);
  return identity.suffix != null && SHAP_COMPOUND_CATEGORY_PREFIX[identity.baseKey] != null;
}

export function filterShapFactorsForDisplay(factors: readonly ShapTopFactor[]): ShapTopFactor[] {
  return factors.filter((f) => !isInactiveOneHotShapFactor(f));
}

export function maxAbsShapContribution(factors: readonly ShapTopFactor[]): number {
  let m = 0;
  for (const f of factors) {
    const v = f.contribution_score;
    if (v == null || Number.isNaN(Number(v))) {
      continue;
    }
    const a = Math.abs(Number(v));
    if (a > m) {
      m = a;
    }
  }
  return m;
}

export function shapRelativeIntensityLabel(absScore: number, batchMaxAbs: number): string | null {
  if (batchMaxAbs <= 0 || absScore <= 0) {
    return null;
  }
  const r = absScore / batchMaxAbs;
  if (r >= SHAP_INTENSITY_RELATIVE_THRESHOLDS.high) {
    return SHAP_DISPLAY_UI.intensityHigh;
  }
  if (r >= SHAP_INTENSITY_RELATIVE_THRESHOLDS.medium) {
    return SHAP_DISPLAY_UI.intensityMedium;
  }
  return SHAP_DISPLAY_UI.intensityLow;
}

function pushRow(rows: { label: string; value: string }[], label: string, value: unknown): void {
  if (value == null) {
    return;
  }
  const s = typeof value === 'string' ? value.trim() : String(value);
  if (s === '') {
    return;
  }
  rows.push({ label, value: s });
}

function formatImpactDirectionLabel(direction: string | undefined | null): string | undefined {
  if (direction == null || String(direction).trim() === '') {
    return undefined;
  }
  const kind = classifyShapDirection(direction);
  if (kind === 'increase' || kind === 'decrease' || kind === 'neutral') {
    return shapImpactLabel(kind);
  }
  return String(direction).trim();
}

function buildTechnicalRows(input: {
  featureName?: string;
  featureValue?: number;
  shapScore?: number;
  direction?: string;
  apiText?: string;
}): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  pushRow(rows, SHAP_DISPLAY_UI.technicalLabels.modelFeature, input.featureName);
  pushRow(rows, SHAP_DISPLAY_UI.technicalLabels.processedModelValue, input.featureValue);
  pushRow(rows, SHAP_DISPLAY_UI.technicalLabels.shapValue, input.shapScore);
  pushRow(rows, SHAP_DISPLAY_UI.technicalLabels.impactDirection, formatImpactDirectionLabel(input.direction));
  const apiText = input.apiText?.trim();
  if (apiText) {
    const label = interpretationLooksTechnical(apiText)
      ? SHAP_DISPLAY_UI.technicalLabels.apiInterpretation
      : SHAP_DISPLAY_UI.technicalLabels.apiMessage;
    pushRow(rows, label, apiText);
  }
  return rows;
}

function pickNarrativeExtra(
  generatedDetail: string | null,
  apiText: string | undefined,
  friendlyTitle: string,
  primaryExplanation: string
): string | null {
  if (generatedDetail && generatedDetail !== primaryExplanation) {
    return generatedDetail;
  }
  const interp = apiText?.trim();
  if (interp && !interpretationLooksTechnical(interp) && interp !== friendlyTitle && interp !== primaryExplanation) {
    return interp;
  }
  return null;
}

export function buildShapFactorUserView(factor: ShapTopFactor, batchMaxAbs: number): ShapFactorUserView {
  const friendlyTitle = shapFriendlyFeatureTitle(factor.feature_name);
  const impactKind = classifyShapDirection(factor.direction);
  const impactLabel = shapImpactLabel(impactKind);
  const identity = parseShapFeatureIdentity(factor.feature_name, factor.feature_value);
  const narrative = buildContextualShapNarrative(identity, impactKind);
  const primaryExplanation = narrative.primary;

  const narrativeExtra = pickNarrativeExtra(
    narrative.detail,
    factor.interpretation,
    friendlyTitle,
    primaryExplanation
  );

  const contrib = factor.contribution_score;
  const absContrib = contrib != null && !Number.isNaN(Number(contrib)) ? Math.abs(Number(contrib)) : 0;
  const intensityLabel = absContrib > 0 ? shapRelativeIntensityLabel(absContrib, batchMaxAbs) : null;

  const interp = factor.interpretation?.trim();
  const apiTextForTechnical =
    interp && (interpretationLooksTechnical(interp) || narrativeExtra !== interp) ? interp : undefined;

  const technicalRows = buildTechnicalRows({
    featureName: factor.feature_name,
    featureValue: factor.feature_value,
    shapScore: contrib,
    direction: factor.direction,
    apiText: apiTextForTechnical
  });

  return {
    friendlyTitle,
    impactKind,
    impactLabel,
    intensityLabel,
    primaryExplanation,
    narrativeExtra,
    hasTechnicalPanel: technicalRows.length > 0,
    technicalRows
  };
}

export function buildShapExplanationUserView(ex: ShapExplanation): ShapExplanationUserView {
  const friendlyTitle = shapFriendlyFeatureTitle(ex.feature_name);
  const impactKind = classifyShapDirection(ex.direction);
  const impactLabel = shapImpactLabel(impactKind);
  const identity = parseShapFeatureIdentity(ex.feature_name);
  const narrative = buildContextualShapNarrative(identity, impactKind);
  const primaryExplanation = narrative.primary;

  const msg = ex.message?.trim();
  const narrativeExtra = pickNarrativeExtra(narrative.detail, msg, friendlyTitle, primaryExplanation);

  const apiTextForTechnical = msg && (interpretationLooksTechnical(msg) || narrativeExtra !== msg) ? msg : undefined;

  const technicalRows = buildTechnicalRows({
    featureName: ex.feature_name,
    shapScore: ex.impact_score,
    direction: ex.direction,
    apiText: apiTextForTechnical
  });

  return {
    friendlyTitle,
    impactKind,
    impactLabel,
    primaryExplanation,
    narrativeExtra,
    hasTechnicalPanel: technicalRows.length > 0,
    technicalRows
  };
}
