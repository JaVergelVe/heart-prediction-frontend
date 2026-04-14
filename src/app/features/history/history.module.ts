import { NgModule } from '@angular/core';
import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HistoryHomeComponent } from './components/history-home/history-home.component';

@NgModule({
  declarations: [HistoryHomeComponent],
  imports: [SharedModule, HistoryRoutingModule]
})
export class HistoryModule {}
