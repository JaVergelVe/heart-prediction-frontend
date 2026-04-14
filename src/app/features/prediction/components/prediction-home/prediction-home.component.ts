import { Component } from '@angular/core';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { PREDICTION_HOME_UI } from '../../../../core/constants/ui/prediction-ui.constant';

@Component({
  selector: 'app-prediction-home',
  templateUrl: './prediction-home.component.html',
  styleUrl: './prediction-home.component.scss'
})
export class PredictionHomeComponent {
  readonly ui = PREDICTION_HOME_UI;
  readonly routes = APP_ROUTE_URLS;
}
