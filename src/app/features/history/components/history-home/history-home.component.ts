import { Component, OnInit, inject } from '@angular/core';
import { HISTORY_MESSAGES } from '../../../../core/constants/messages/history-messages.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import {
  HISTORY_LIST_COLUMN_KEYS,
  HISTORY_LIST_DISPLAYED_COLUMNS
} from '../../../../core/constants/ui/history-ui.constant';
import {
  PredictionRiskPillKind
} from '../../../../core/constants/prediction-result-risk.constant';
import { PredictionResultData } from '../../../../core/models/prediction-response.model';
import { PredictionService } from '../../../../core/services/prediction.service';
import { predictionRiskDisplayLabel, predictionRiskPillKind } from '../../../../core/utils/prediction-risk-display.util';
import { isUnauthorizedHttpError } from '../../../../core/utils/http-unauthorized-status.util';

@Component({
  selector: 'app-history-home',
  templateUrl: './history-home.component.html',
  styleUrl: './history-home.component.scss'
})
export class HistoryHomeComponent implements OnInit {
  private readonly predictionApi = inject(PredictionService);

  readonly messages = HISTORY_MESSAGES;
  readonly cols = HISTORY_LIST_COLUMN_KEYS;
  readonly displayedColumns = HISTORY_LIST_DISPLAYED_COLUMNS;
  readonly historyBaseUrl = APP_ROUTE_URLS.history;

  rows: PredictionResultData[] = [];
  loading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.loadError = null;
    this.predictionApi.getAuthenticatedHistory().subscribe({
      next: (items) => {
        this.rows = this.sortByTimestampDesc(items);
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        if (isUnauthorizedHttpError(err)) {
          return;
        }
        this.loadError = this.messages.loadListError;
      }
    });
  }

  riskDisplayLabel(riskLevel: string | undefined): string {
    return predictionRiskDisplayLabel(riskLevel);
  }

  riskPillKind(riskLevel: string | undefined): PredictionRiskPillKind {
    return predictionRiskPillKind(riskLevel);
  }

  private sortByTimestampDesc(items: PredictionResultData[]): PredictionResultData[] {
    return [...items].sort((a, b) => {
      const ta = Date.parse(a.prediction_timestamp);
      const tb = Date.parse(b.prediction_timestamp);
      const na = Number.isFinite(ta) ? ta : 0;
      const nb = Number.isFinite(tb) ? tb : 0;
      return nb - na;
    });
  }
}
