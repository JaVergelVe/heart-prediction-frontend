import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LandingHomeComponent } from './components/landing-home/landing-home.component';

@NgModule({
  declarations: [LandingHomeComponent],
  imports: [SharedModule, MatChipsModule, MatExpansionModule, LandingRoutingModule]
})
export class LandingModule {}
