import { Component } from '@angular/core';
import { LANDING_PAGE_UI } from '../../../../core/constants/ui/landing-ui.constant';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.scss'
})
export class LandingHomeComponent {
  readonly ui = LANDING_PAGE_UI;
}
