import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  PREDICTION_RISK_LEVEL_KEYWORDS,
  PredictionRiskPillKind
} from '../../../../core/constants/prediction-result-risk.constant';
import { PREDICTION_ROUTER_STATE_KEYS } from '../../../../core/constants/prediction-router-state.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import {
  PREDICTION_FLOW_KIND,
  PREDICTION_RESULT_UI,
  PredictionFlowKind
} from '../../../../core/constants/ui/prediction-ui.constant';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../../../../core/models/prediction-response.model';

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.component.html',
  styleUrl: './prediction-result.component.scss'
})
export class PredictionResultComponent implements OnInit {
  private readonly location = inject(Location);

  readonly ui = PREDICTION_RESULT_UI;
  readonly routes = APP_ROUTE_URLS;
  readonly flowKindConst = PREDICTION_FLOW_KIND;

  result: PredictionResultData | null = null;
  flowKind: PredictionFlowKind | null = null;

  ngOnInit(): void {
    const st = this.location.getState() as Record<string, unknown>;
    const f = st[PREDICTION_ROUTER_STATE_KEYS.flowKind];
    const r = st[PREDICTION_ROUTER_STATE_KEYS.result];
    this.flowKind =
      f === PREDICTION_FLOW_KIND.anonymous || f === PREDICTION_FLOW_KIND.authenticated
        ? (f as PredictionFlowKind)
        : null;
    this.result = r && typeof r === 'object' ? (r as PredictionResultData) : null;
  }

  get backRoute(): string {
    return this.flowKind === PREDICTION_FLOW_KIND.authenticated
      ? APP_ROUTE_URLS.predictionsAuthenticated
      : APP_ROUTE_URLS.predictionsAnonymous;
  }

  get backLabel(): string {
    return this.flowKind === PREDICTION_FLOW_KIND.authenticated
      ? PREDICTION_RESULT_UI.backToAuthenticated
      : PREDICTION_RESULT_UI.backToAnonymous;
  }

  get modelVersionDisplay(): string {
    const v = this.result?.model_version;
    if (v != null && String(v).trim() !== '') {
      return String(v).trim();
    }
    return PREDICTION_RESULT_UI.labels.modelVersionUnavailable;
  }

  get hasPredictedClass(): boolean {
    const c = this.result?.predicted_class;
    return c != null && String(c).trim() !== '';
  }

  riskPillKind(): PredictionRiskPillKind {
    const s = (this.result?.risk_level ?? '').trim().toLowerCase();
    const low = PREDICTION_RISK_LEVEL_KEYWORDS.low as readonly string[];
    const medium = PREDICTION_RISK_LEVEL_KEYWORDS.medium as readonly string[];
    const high = PREDICTION_RISK_LEVEL_KEYWORDS.high as readonly string[];
    if (low.includes(s)) {
      return 'low';
    }
    if (medium.includes(s)) {
      return 'medium';
    }
    if (high.includes(s)) {
      return 'high';
    }
    return 'unknown';
  }

  shapExplanation(): ShapExplanation | null {
    const e = this.result?.shap_explanation;
    if (!e || typeof e !== 'object') {
      return null;
    }
    if (e.feature_name || e.message || e.impact_score != null || e.direction) {
      return e;
    }
    return null;
  }

  shapFactors(): ShapTopFactor[] {
    const f = this.result?.shap_top_factors;
    return Array.isArray(f) ? f : [];
  }

  get showFlowAmbiguousNav(): boolean {
    return this.result != null && this.flowKind == null;
  }
}
