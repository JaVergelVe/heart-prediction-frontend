import {
  SHAP_AGE_CATEGORY_SUFFIX_LABELS,
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

export function buildShapFactorUserView(factor: ShapTopFactor, batchMaxAbs: number): ShapFactorUserView {
  const friendlyTitle = shapFriendlyFeatureTitle(factor.feature_name);
  const impactKind = classifyShapDirection(factor.direction);
  const impactLabel = shapImpactLabel(impactKind);
  const primaryExplanation = shapPrimaryExplanation(impactKind);

  const interp = factor.interpretation?.trim();
  const narrativeExtra =
    interp && !interpretationLooksTechnical(interp) && interp !== friendlyTitle ? interp : null;

  const contrib = factor.contribution_score;
  const absContrib = contrib != null && !Number.isNaN(Number(contrib)) ? Math.abs(Number(contrib)) : 0;
  const intensityLabel = absContrib > 0 ? shapRelativeIntensityLabel(absContrib, batchMaxAbs) : null;

  const technicalRows: { label: string; value: string }[] = [];
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.internalFeatureName, factor.feature_name);
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.rawDirection, factor.direction);
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.contributionScore, contrib);
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.modelValue, factor.feature_value);
  if (interp && (interpretationLooksTechnical(interp) || narrativeExtra == null)) {
    pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.apiInterpretation, interp);
  }

  const hasTechnicalPanel = technicalRows.length > 0;

  return {
    friendlyTitle,
    impactKind,
    impactLabel,
    intensityLabel,
    primaryExplanation,
    narrativeExtra,
    hasTechnicalPanel,
    technicalRows
  };
}

export function buildShapExplanationUserView(ex: ShapExplanation): ShapExplanationUserView {
  const friendlyTitle = shapFriendlyFeatureTitle(ex.feature_name);
  const impactKind = classifyShapDirection(ex.direction);
  const impactLabel = shapImpactLabel(impactKind);
  const primaryExplanation = shapPrimaryExplanation(impactKind);

  const msg = ex.message?.trim();
  const narrativeExtra =
    msg && !interpretationLooksTechnical(msg) && msg !== friendlyTitle ? msg : null;

  const technicalRows: { label: string; value: string }[] = [];
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.internalFeatureName, ex.feature_name);
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.rawDirection, ex.direction);
  pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.impactScore, ex.impact_score);
  if (msg && (interpretationLooksTechnical(msg) || narrativeExtra == null)) {
    pushRow(technicalRows, SHAP_DISPLAY_UI.technicalLabels.apiMessage, msg);
  }

  const hasTechnicalPanel = technicalRows.length > 0;

  return {
    friendlyTitle,
    impactKind,
    impactLabel,
    primaryExplanation,
    narrativeExtra,
    hasTechnicalPanel,
    technicalRows
  };
}
