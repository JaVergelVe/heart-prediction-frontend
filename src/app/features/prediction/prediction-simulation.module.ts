import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { PredictionWhatIfPanelComponent } from '../history/components/prediction-what-if-panel/prediction-what-if-panel.component';

/** Panel de simulación What-If reutilizable en historial y resultado de predicción. */
@NgModule({
  declarations: [PredictionWhatIfPanelComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatButtonModule
  ],
  exports: [PredictionWhatIfPanelComponent]
})
export class PredictionSimulationModule {}
