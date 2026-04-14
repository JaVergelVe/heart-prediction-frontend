import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_ROUTE_URLS } from './core/constants/route-urls.constant';
import { ROUTE_SEGMENTS } from './core/constants/route-segments.constant';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule)
      },
      {
        path: ROUTE_SEGMENTS.auth,
        loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
      },
      {
        path: ROUTE_SEGMENTS.predictions,
        loadChildren: () =>
          import('./features/prediction/prediction.module').then((m) => m.PredictionModule)
      },
      {
        path: ROUTE_SEGMENTS.history,
        loadChildren: () => import('./features/history/history.module').then((m) => m.HistoryModule)
      },
      {
        path: ROUTE_SEGMENTS.profile,
        loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
      }
    ]
  },
  { path: '**', redirectTo: APP_ROUTE_URLS.home, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
