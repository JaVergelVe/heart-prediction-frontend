import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, distinctUntilChanged, map, switchMap } from 'rxjs';
import { HISTORY_ROUTE_PARAM_KEYS } from '../../../../core/constants/history-route-params.constant';
import { HISTORY_MESSAGES } from '../../../../core/constants/messages/history-messages.constant';
import { PredictionRiskPillKind } from '../../../../core/constants/prediction-result-risk.constant';
import { SHAP_DISPLAY_UI } from '../../../../core/constants/shap-display.constant';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../../../../core/models/prediction-response.model';
import { filterShapFactorsForDisplay, maxAbsShapContribution } from '../../../../core/utils/shap-display.util';
import { PredictionService } from '../../../../core/services/prediction.service';
import { PredictionPdfExportService } from '../../../../core/services/prediction-pdf-export.service';
import { triggerBrowserBlobDownload } from '../../../../core/utils/browser-file-download.util';
import { predictionRiskPillKind, predictionRiskDisplayLabel } from '../../../../core/utils/prediction-risk-display.util';
import { isUnauthorizedHttpError } from '../../../../core/utils/http-unauthorized-status.util';

@Component({
  selector: 'app-prediction-history-detail',
  templateUrl: './prediction-history-detail.component.html',
  styleUrl: './prediction-history-detail.component.scss'
})
export class PredictionHistoryDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly predictionApi = inject(PredictionService);
  private readonly pdfExport = inject(PredictionPdfExportService);

  private sub: Subscription | null = null;

  readonly messages = HISTORY_MESSAGES;
  readonly shapUi = SHAP_DISPLAY_UI;

  result: PredictionResultData | null = null;
  loading = false;
  loadError: string | null = null;

  pdfDownloading = false;
  pdfError: string | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap
      .pipe(
        map((params) => params.get(HISTORY_ROUTE_PARAM_KEYS.predictionId)),
        distinctUntilChanged(),
        switchMap((id) => {
          this.loadError = null;
          this.result = null;
          this.pdfError = null;
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
          this.pdfError = null;
        },
        error: (err: unknown) => {
          this.loading = false;
          this.result = null;
          if (isUnauthorizedHttpError(err)) {
            return;
          }
          this.loadError = this.messages.loadDetailError;
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
    this.pdfError = null;
    this.predictionApi.getAuthenticatedPredictionById(id).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
        this.pdfError = null;
      },
      error: (err: unknown) => {
        this.loading = false;
        if (isUnauthorizedHttpError(err)) {
          return;
        }
        this.loadError = this.messages.loadDetailError;
      }
    });
  }

  get modelVersionDisplay(): string {
    const v = this.result?.model_version;
    if (v != null && String(v).trim() !== '') {
      return String(v).trim();
    }
    return 'No disponible';
  }

  get hasPredictedClass(): boolean {
    const c = this.result?.predicted_class;
    return c != null && String(c).trim() !== '';
  }

  riskPillKind(): PredictionRiskPillKind {
    return predictionRiskPillKind(this.result?.risk_level);
  }

  riskDisplayLabel(): string {
    return predictionRiskDisplayLabel(this.result?.risk_level);
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
    return filterShapFactorsForDisplay(Array.isArray(f) ? f : []);
  }

  get shapFactorsMaxAbs(): number {
    return maxAbsShapContribution(this.shapFactors());
  }

  downloadPdf(): void {
    const data = this.result;
    if (!data?.prediction_id || this.loading || this.pdfDownloading) {
      return;
    }
    this.pdfError = null;
    this.pdfDownloading = true;
    try {
      const blob = this.pdfExport.buildPdfBlob(data);
      const filename = this.pdfExport.buildFilename(data.prediction_id);
      triggerBrowserBlobDownload(blob, filename);
    } catch {
      this.pdfError = this.messages.pdfDownloadEmpty;
    } finally {
      this.pdfDownloading = false;
    }
  }
}
