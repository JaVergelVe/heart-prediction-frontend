import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
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

@NgModule({
  declarations: [
    AnonymousPredictionPageComponent,
    AuthenticatedPredictionPageComponent,
    PredictionResultComponent,
    PredictionSurveyFieldsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    PredictionRoutingModule
  ]
})
export class PredictionModule {}
