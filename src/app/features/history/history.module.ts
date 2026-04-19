import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HistoryHomeComponent } from './components/history-home/history-home.component';
import { PredictionHistoryDetailComponent } from './components/prediction-history-detail/prediction-history-detail.component';

@NgModule({
  declarations: [HistoryHomeComponent, PredictionHistoryDetailComponent],
  imports: [SharedModule, HistoryRoutingModule, MatTableModule, MatDividerModule]
})
export class HistoryModule {}
