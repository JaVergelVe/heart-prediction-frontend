import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HISTORY_ROUTE_PARAM_KEYS } from '../../core/constants/history-route-params.constant';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HistoryHomeComponent } from './components/history-home/history-home.component';
import { PredictionHistoryDetailComponent } from './components/prediction-history-detail/prediction-history-detail.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HistoryHomeComponent },
      {
        path: `:${HISTORY_ROUTE_PARAM_KEYS.predictionId}`,
        component: PredictionHistoryDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}
