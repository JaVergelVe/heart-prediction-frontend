import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { ShapExplanationUserCardComponent } from './components/shap-explanation-user-card/shap-explanation-user-card.component';
import { ShapFactorUserCardComponent } from './components/shap-factor-user-card/shap-factor-user-card.component';
import { MedicalConditionsFieldsComponent } from './components/medical-conditions-fields/medical-conditions-fields.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    LoadingSpinnerComponent,
    RevealOnScrollDirective,
    ShapFactorUserCardComponent,
    ShapExplanationUserCardComponent,
    MedicalConditionsFieldsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    LoadingSpinnerComponent,
    RevealOnScrollDirective,
    ShapFactorUserCardComponent,
    ShapExplanationUserCardComponent,
    MedicalConditionsFieldsComponent,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule
  ]
})
export class SharedModule {}
