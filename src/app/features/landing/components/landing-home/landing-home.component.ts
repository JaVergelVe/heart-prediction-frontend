import { Component } from '@angular/core';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.scss'
})
export class LandingHomeComponent {
  readonly routes = APP_ROUTE_URLS;
}
