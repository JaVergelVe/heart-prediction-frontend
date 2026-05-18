import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PredictionSimulationModule } from '../prediction/prediction-simulation.module';
import { HistoryHomeComponent } from './components/history-home/history-home.component';
import { PredictionHistoryDetailComponent } from './components/prediction-history-detail/prediction-history-detail.component';

@NgModule({
  declarations: [HistoryHomeComponent, PredictionHistoryDetailComponent],
  imports: [
    SharedModule,
    HistoryRoutingModule,
    PredictionSimulationModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class HistoryModule {}
