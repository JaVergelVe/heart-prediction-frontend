import { Component, Input, OnChanges } from '@angular/core';
import { SHAP_DISPLAY_UI } from '../../../core/constants/shap-display.constant';
import type { ShapExplanation } from '../../../core/models/prediction-response.model';
import { buildShapExplanationUserView, type ShapExplanationUserView } from '../../../core/utils/shap-display.util';

@Component({
  selector: 'app-shap-explanation-user-card',
  templateUrl: './shap-explanation-user-card.component.html',
  styleUrl: './shap-explanation-user-card.component.scss'
})
export class ShapExplanationUserCardComponent implements OnChanges {
  @Input({ required: true }) explanation!: ShapExplanation;

  readonly ui = SHAP_DISPLAY_UI;

  view: ShapExplanationUserView = buildShapExplanationUserView({} as ShapExplanation);

  ngOnChanges(): void {
    if (this.explanation) {
      this.view = buildShapExplanationUserView(this.explanation);
    }
  }
}
