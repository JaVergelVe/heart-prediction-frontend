import { NgModule } from '@angular/core';
import { PredictionRoutingModule } from './prediction-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PredictionHomeComponent } from './components/prediction-home/prediction-home.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';

@NgModule({
  declarations: [PredictionHomeComponent, PredictionResultComponent],
  imports: [SharedModule, PredictionRoutingModule]
})
export class PredictionModule {}
