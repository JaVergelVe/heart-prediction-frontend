import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, distinctUntilChanged, map, switchMap } from 'rxjs';
import { HISTORY_ROUTE_PARAM_KEYS } from '../../../../core/constants/history-route-params.constant';
import { HISTORY_MESSAGES } from '../../../../core/constants/messages/history-messages.constant';
import {
  PREDICTION_RISK_LEVEL_KEYWORDS,
  PredictionRiskPillKind
} from '../../../../core/constants/prediction-result-risk.constant';
import { PREDICTION_RESULT_UI } from '../../../../core/constants/ui/prediction-ui.constant';
import { HISTORY_DETAIL_PAGE_UI } from '../../../../core/constants/ui/history-ui.constant';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../../../../core/models/prediction-response.model';
import { PredictionService } from '../../../../core/services/prediction.service';

@Component({
  selector: 'app-prediction-history-detail',
  templateUrl: './prediction-history-detail.component.html',
  styleUrl: './prediction-history-detail.component.scss'
})
export class PredictionHistoryDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly predictionApi = inject(PredictionService);

  private sub: Subscription | null = null;

  readonly pageUi = HISTORY_DETAIL_PAGE_UI;
  readonly resultUi = PREDICTION_RESULT_UI;
  readonly messages = HISTORY_MESSAGES;

  result: PredictionResultData | null = null;
  loading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap
      .pipe(
        map((params) => params.get(HISTORY_ROUTE_PARAM_KEYS.predictionId)),
        distinctUntilChanged(),
        switchMap((id) => {
          this.loadError = null;
          this.result = null;
          if (!id) {
            this.loading = false;
            this.loadError = this.messages.loadDetailError;
            return EMPTY;
          }
          this.loading = true;
          return this.predictionApi.getAuthenticatedPredictionById(id);
        })
      )
      .subscribe({
        next: (data) => {
          this.result = data;
          this.loading = false;
        },
        error: () => {
          this.loadError = this.messages.loadDetailError;
          this.loading = false;
          this.result = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  retry(): void {
    const id = this.route.snapshot.paramMap.get(HISTORY_ROUTE_PARAM_KEYS.predictionId);
    if (!id) {
      return;
    }
    this.loading = true;
    this.loadError = null;
    this.result = null;
    this.predictionApi.getAuthenticatedPredictionById(id).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: () => {
        this.loadError = this.messages.loadDetailError;
        this.loading = false;
      }
    });
  }

  get modelVersionDisplay(): string {
    const v = this.result?.model_version;
    if (v != null && String(v).trim() !== '') {
      return String(v).trim();
    }
    return this.resultUi.labels.modelVersionUnavailable;
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
}
