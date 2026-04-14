import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfileHomeComponent } from './components/profile-home/profile-home.component';

@NgModule({
  declarations: [ProfileHomeComponent],
  imports: [SharedModule, ProfileRoutingModule]
})
export class ProfileModule {}
