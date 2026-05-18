import { Component, Input, OnChanges } from '@angular/core';
import { SHAP_DISPLAY_UI } from '../../../core/constants/shap-display.constant';
import type { ShapTopFactor } from '../../../core/models/prediction-response.model';
import { buildShapFactorUserView, type ShapFactorUserView } from '../../../core/utils/shap-display.util';

@Component({
  selector: 'app-shap-factor-user-card',
  templateUrl: './shap-factor-user-card.component.html',
  styleUrl: './shap-factor-user-card.component.scss',
  host: { role: 'listitem' }
})
export class ShapFactorUserCardComponent implements OnChanges {
  @Input({ required: true }) factor!: ShapTopFactor;
  @Input() batchMaxAbs = 0;

  readonly ui = SHAP_DISPLAY_UI;

  view: ShapFactorUserView = buildShapFactorUserView({} as ShapTopFactor, 0);

  ngOnChanges(): void {
    if (this.factor) {
      this.view = buildShapFactorUserView(this.factor, this.batchMaxAbs);
    }
  }
}
