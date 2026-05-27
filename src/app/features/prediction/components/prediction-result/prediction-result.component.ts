import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PredictionRiskPillKind } from '../../../../core/constants/prediction-result-risk.constant';
import { PREDICTION_ROUTER_STATE_KEYS } from '../../../../core/constants/prediction-router-state.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import {
  PREDICTION_FLOW_KIND,
  PREDICTION_RESULT_UI,
  PredictionFlowKind
} from '../../../../core/constants/ui/prediction-ui.constant';
import { SHAP_DISPLAY_UI } from '../../../../core/constants/shap-display.constant';
import { HISTORY_MESSAGES } from '../../../../core/constants/messages/history-messages.constant';
import { PredictionResultData, ShapExplanation, ShapTopFactor } from '../../../../core/models/prediction-response.model';
import { PredictionPdfExportService } from '../../../../core/services/prediction-pdf-export.service';
import { triggerBrowserBlobDownload } from '../../../../core/utils/browser-file-download.util';
import { filterShapFactorsForDisplay, maxAbsShapContribution } from '../../../../core/utils/shap-display.util';
import { predictionRiskPillKind, predictionRiskDisplayLabel } from '../../../../core/utils/prediction-risk-display.util';

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.component.html',
  styleUrl: './prediction-result.component.scss'
})
export class PredictionResultComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly pdfExport = inject(PredictionPdfExportService);

  @ViewChild('whatIfAnchor') private whatIfAnchor?: ElementRef<HTMLElement>;

  readonly ui = PREDICTION_RESULT_UI;
  readonly shapUi = SHAP_DISPLAY_UI;
  readonly routes = APP_ROUTE_URLS;
  readonly flowKindConst = PREDICTION_FLOW_KIND;

  result: PredictionResultData | null = null;
  flowKind: PredictionFlowKind | null = null;
  whatIfOpen = false;
  pdfDownloading = false;
  pdfError: string | null = null;

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

  get showFlowAmbiguousNav(): boolean {
    return this.result != null && this.flowKind == null;
  }

  get canOpenWhatIf(): boolean {
    return (
      this.flowKind === PREDICTION_FLOW_KIND.authenticated &&
      this.result != null &&
      String(this.result.prediction_id ?? '').trim() !== ''
    );
  }

  get canDownloadPdf(): boolean {
    return this.result != null && String(this.result.prediction_id ?? '').trim() !== '';
  }

  downloadPdf(): void {
    const data = this.result;
    if (!data?.prediction_id || this.pdfDownloading) {
      return;
    }
    this.pdfError = null;
    this.pdfDownloading = true;
    try {
      const blob = this.pdfExport.buildPdfBlob(data);
      const filename = this.pdfExport.buildFilename(data.prediction_id);
      triggerBrowserBlobDownload(blob, filename);
    } catch {
      this.pdfError = HISTORY_MESSAGES.pdfDownloadEmpty;
    } finally {
      this.pdfDownloading = false;
    }
  }

  openWhatIfSimulator(): void {
    if (!this.canOpenWhatIf) {
      return;
    }
    this.whatIfOpen = true;
    queueMicrotask(() => {
      this.whatIfAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
