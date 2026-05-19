import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { AnonymousPredictionPageComponent } from './components/anonymous-prediction-page/anonymous-prediction-page.component';
import { AuthenticatedPredictionPageComponent } from './components/authenticated-prediction-page/authenticated-prediction-page.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';
import { PredictionSurveyFieldsComponent } from './components/prediction-survey-fields/prediction-survey-fields.component';
import { PredictionRoutingModule } from './prediction-routing.module';
import { PredictionSimulationModule } from './prediction-simulation.module';

@NgModule({
  declarations: [
    AnonymousPredictionPageComponent,
    AuthenticatedPredictionPageComponent,
    PredictionResultComponent,
    PredictionSurveyFieldsComponent
  ],
  imports: [
    SharedModule,
    PredictionSimulationModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    PredictionRoutingModule
  ]
})
export class PredictionModule {}
