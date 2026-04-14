import { NgModule } from '@angular/core';
import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LandingHomeComponent } from './components/landing-home/landing-home.component';

@NgModule({
  declarations: [LandingHomeComponent],
  imports: [SharedModule, LandingRoutingModule]
})
export class LandingModule {}
