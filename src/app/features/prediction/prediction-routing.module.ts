import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../../core/constants/route-segments.constant';
import { PredictionHomeComponent } from './components/prediction-home/prediction-home.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';

const routes: Routes = [
  {
    path: ROUTE_SEGMENTS.anonymous,
    children: [
      { path: '', component: PredictionHomeComponent },
      { path: ROUTE_SEGMENTS.result, component: PredictionResultComponent }
    ]
  },
  { path: '**', redirectTo: ROUTE_SEGMENTS.anonymous, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredictionRoutingModule {}
