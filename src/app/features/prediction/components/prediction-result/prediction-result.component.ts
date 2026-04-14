import { Component } from '@angular/core';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { PREDICTION_RESULT_UI } from '../../../../core/constants/ui/prediction-ui.constant';

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.component.html',
  styleUrl: './prediction-result.component.scss'
})
export class PredictionResultComponent {
  readonly ui = PREDICTION_RESULT_UI;
  readonly routes = APP_ROUTE_URLS;
}
