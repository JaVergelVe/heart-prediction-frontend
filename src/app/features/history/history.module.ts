import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HistoryHomeComponent } from './components/history-home/history-home.component';
import { PredictionHistoryDetailComponent } from './components/prediction-history-detail/prediction-history-detail.component';
import { PredictionWhatIfPanelComponent } from './components/prediction-what-if-panel/prediction-what-if-panel.component';

@NgModule({
  declarations: [HistoryHomeComponent, PredictionHistoryDetailComponent, PredictionWhatIfPanelComponent],
  imports: [
    SharedModule,
    HistoryRoutingModule,
    MatTableModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class HistoryModule {}
