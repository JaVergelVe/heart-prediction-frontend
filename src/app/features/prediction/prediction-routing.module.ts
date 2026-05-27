import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ROUTE_SEGMENTS } from '../../core/constants/route-segments.constant';
import { AnonymousPredictionPageComponent } from './components/anonymous-prediction-page/anonymous-prediction-page.component';
import { AuthenticatedPredictionPageComponent } from './components/authenticated-prediction-page/authenticated-prediction-page.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';

const routes: Routes = [
  {
    path: ROUTE_SEGMENTS.anonymous,
    children: [
      { path: '', component: AnonymousPredictionPageComponent },
      { path: ROUTE_SEGMENTS.result, component: PredictionResultComponent }
    ]
  },
  {
    path: ROUTE_SEGMENTS.authenticated,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AuthenticatedPredictionPageComponent },
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
