import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_PATHS } from '../constants/api-paths.constant';
import {
  AnonymousPredictionRequest,
  AuthenticatedPredictionRequest
} from '../models/prediction-api.model';
import {
  PredictionCreateEnvelope,
  PredictionHistoryListEnvelope,
  PredictionResultData
} from '../models/prediction-response.model';
import { extractHistoryItemsFromEnvelope } from '../utils/prediction-history-response.util';
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
}
