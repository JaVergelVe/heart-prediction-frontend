import { HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_PATHS } from '../constants/api-paths.constant';
import { PREDICTION_PDF_EXPORT_DEFAULT_FILENAME_TEMPLATE } from '../constants/prediction-pdf-export.constant';
import {
  AnonymousPredictionRequest,
  AuthenticatedPredictionRequest
} from '../models/prediction-api.model';
import { PredictionSimulateRequestBody } from '../models/prediction-simulation.model';
import {
  PredictionCreateEnvelope,
  PredictionHistoryListEnvelope,
  PredictionResultData
} from '../models/prediction-response.model';
import {
  ParsedSimulateResponse,
  parsePredictionSimulateResponse
} from '../utils/prediction-simulate-response.util';
import { extractHistoryItemsFromEnvelope } from '../utils/prediction-history-response.util';
import { parseFilenameFromContentDisposition } from '../utils/http-content-disposition.util';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private readonly api = inject(ApiService);

  predictAnonymous(body: AnonymousPredictionRequest): Observable<PredictionResultData> {
    return this.api
      .post<PredictionCreateEnvelope>(API_PATHS.predictionAnonymous, body)
      .pipe(map((res) => res.data));
  }

  predictAuthenticated(body: AuthenticatedPredictionRequest): Observable<PredictionResultData> {
    return this.api
      .post<PredictionCreateEnvelope>(API_PATHS.predictionAuthenticated, body)
      .pipe(map((res) => res.data));
  }

  getAuthenticatedHistory(): Observable<PredictionResultData[]> {
    return this.api
      .get<PredictionHistoryListEnvelope>(API_PATHS.predictionHistory)
      .pipe(map((res) => extractHistoryItemsFromEnvelope(res)));
  }

  getAuthenticatedPredictionById(predictionId: string): Observable<PredictionResultData> {
    const path = `${API_PATHS.predictionAuthenticated}/${encodeURIComponent(predictionId)}`;
    return this.api.get<PredictionCreateEnvelope>(path).pipe(map((res) => res.data));
  }

  /** Escenario what-if; no persiste una predicción nueva en el historial. */
  simulateAuthenticatedPrediction(
    predictionId: string,
    body: PredictionSimulateRequestBody,
    baseline: PredictionResultData
  ): Observable<ParsedSimulateResponse> {
    const path = `${API_PATHS.predictionAuthenticated}/${encodeURIComponent(predictionId)}/simulate`;
    return this.api.post<unknown>(path, body).pipe(
      map((raw) => {
        try {
          return parsePredictionSimulateResponse(raw, baseline);
        } catch {
          throw new Error('SIMULATE_RESPONSE_PARSE');
        }
      })
    );
  }

  /** Descarga el PDF de una predicción propia (`GET .../export/pdf`). */
  downloadAuthenticatedPredictionPdf(
    predictionId: string
  ): Observable<{ blob: Blob; filename: string }> {
    const path = `${API_PATHS.predictionAuthenticated}/${encodeURIComponent(predictionId)}/export/pdf`;
    return this.api.getBlobResponse(path).pipe(
      map((resp: HttpResponse<Blob>) => {
        const body = resp.body;
        if (!body || body.size === 0) {
          throw new Error('PDF_EMPTY');
        }
        const contentType = (resp.headers.get('Content-Type') ?? '').toLowerCase();
        if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
          throw new Error('PDF_BAD_TYPE');
        }
        const fromHeader = parseFilenameFromContentDisposition(resp.headers.get('Content-Disposition'));
        const fallback = PREDICTION_PDF_EXPORT_DEFAULT_FILENAME_TEMPLATE.replace('{predictionId}', predictionId);
        return { blob: body, filename: fromHeader ?? fallback };
      })
    );
  }
}
