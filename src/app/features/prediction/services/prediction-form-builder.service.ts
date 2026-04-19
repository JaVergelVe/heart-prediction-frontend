import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VALIDATION_LIMITS } from '../../../core/constants/validation-limits.constant';
import { RegisterMedicalIn, RegisterProfileIn } from '../../../core/models/register-request.model';
import { PREDICTION_TRISTATE_FORM } from '../../../core/constants/data/prediction-survey-options.constant';

@Injectable({
  providedIn: 'root'
})
export class PredictionFormBuilderService {
  private readonly fb = inject(FormBuilder);
  private readonly limits = VALIDATION_LIMITS;

  createAnonymousForm(): FormGroup {
    return this.fb.group({
      profile: this.createProfileGroup(),
      medical_conditions: this.createMedicalGroup(),
      survey: this.createSurveyGroup(),
      weight_kilograms: this.createWeightControl()
    });
  }

  createAuthenticatedForm(): FormGroup {
    return this.fb.group({
      survey: this.createSurveyGroup(),
      weight_kilograms: this.createWeightControl()
    });
  }

  /** Solo variables permitidas en POST `/v1/predictions/{id}/simulate` (detalle / what-if). */
  createSimulationForm(): FormGroup {
    const tri = PREDICTION_TRISTATE_FORM.unset;
    return this.fb.group({
      weight_kilograms: this.createWeightControl(),
      general_health: [''],
      physical_health_days: [
        null as number | null,
        [Validators.min(this.limits.healthDaysMin), Validators.max(this.limits.healthDaysMax)]
      ],
      mental_health_days: [
        null as number | null,
        [Validators.min(this.limits.healthDaysMin), Validators.max(this.limits.healthDaysMax)]
      ],
      physical_activities: [tri],
      sleep_hours: [
        null as number | null,
        [Validators.min(this.limits.sleepHoursMin), Validators.max(this.limits.sleepHoursMax)]
      ],
      smoker_status: [''],
      ecigarette_usage: [''],
      alcohol_drinkers: [tri]
    });
  }

  createProfileGroup(): FormGroup {
    return this.fb.group({
      sex: ['' as RegisterProfileIn['sex'] | '', [Validators.required]],
      birth_date: ['', [Validators.required]],
      height_meters: [
        null as number | null,
        [
          Validators.required,
          Validators.min(this.limits.heightMetersMin),
          Validators.max(this.limits.heightMetersMax)
        ]
      ],
      removed_teeth: ['' as RegisterProfileIn['removed_teeth'] | '', [Validators.required]]
    });
  }

  /** Solo campos actualizables vía `PUT /v1/users/me/profile` (altura y dientes). */
  createProfileUpdateGroup(): FormGroup {
    return this.fb.group({
      height_meters: [
        null as number | null,
        [Validators.min(this.limits.heightMetersMin), Validators.max(this.limits.heightMetersMax)]
      ],
      removed_teeth: ['' as RegisterProfileIn['removed_teeth'] | '', [Validators.required]]
    });
  }

  createMedicalGroup(): FormGroup {
    return this.fb.group({
      had_angina: this.fb.nonNullable.control(false),
      had_stroke: this.fb.nonNullable.control(false),
      had_asthma: this.fb.nonNullable.control(false),
      had_copd: this.fb.nonNullable.control(false),
      had_skin_cancer: this.fb.nonNullable.control(false),
      had_depressive_disorder: this.fb.nonNullable.control(false),
      had_kidney_disease: this.fb.nonNullable.control(false),
      had_arthritis: this.fb.nonNullable.control(false),
      had_diabetes: ['' as RegisterMedicalIn['had_diabetes'] | '', [Validators.required]],
      deaf_or_hard_of_hearing: this.fb.nonNullable.control(false),
      blind_or_vision_difficulty: this.fb.nonNullable.control(false),
      difficulty_concentrating: this.fb.nonNullable.control(false),
      difficulty_walking: this.fb.nonNullable.control(false),
      difficulty_dressing_bathing: this.fb.nonNullable.control(false),
      difficulty_errands: this.fb.nonNullable.control(false)
    });
  }

  createSurveyGroup(): FormGroup {
    const tri = PREDICTION_TRISTATE_FORM.unset;
    return this.fb.group({
      general_health: [''],
      physical_health_days: [
        null as number | null,
        [Validators.min(this.limits.healthDaysMin), Validators.max(this.limits.healthDaysMax)]
      ],
      mental_health_days: [
        null as number | null,
        [Validators.min(this.limits.healthDaysMin), Validators.max(this.limits.healthDaysMax)]
      ],
      last_checkup_time: [''],
      physical_activities: [tri],
      sleep_hours: [
        null as number | null,
        [Validators.min(this.limits.sleepHoursMin), Validators.max(this.limits.sleepHoursMax)]
      ],
      smoker_status: [''],
      ecigarette_usage: [''],
      alcohol_drinkers: [tri],
      chest_scan: [tri],
      hiv_testing: [tri],
      flu_vax_last_12: [tri],
      pneumo_vax_ever: [tri],
      tetanus_last_10_tdap: [''],
      high_risk_last_year: [tri],
      covid_pos: ['']
    });
  }

  createWeightControl(): FormControl<number | null> {
    return this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(this.limits.weightKgMin),
      Validators.max(this.limits.weightKgMax)
    ]);
  }
}
