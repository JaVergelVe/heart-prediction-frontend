import { Component, Input } from '@angular/core';
import { LOADING_SPINNER_UI } from '../../../core/constants/ui/loading-ui.constant';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  @Input() diameter = 48;

  readonly spinnerUi = LOADING_SPINNER_UI;
}
