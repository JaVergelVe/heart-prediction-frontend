import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  PREDICTION_REMOVED_TEETH_OPTIONS,
  PREDICTION_SEX_OPTIONS
} from '../../../../core/constants/data/prediction-survey-options.constant';
import { PREDICTION_HAD_DIABETES_OPTIONS } from '../../../../core/constants/data/prediction-survey-options.constant';
import { PROFILE_PAGE_UI } from '../../../../core/constants/ui/profile-ui.constant';
import { PROFILE_MESSAGES } from '../../../../core/constants/messages/profile-messages.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import { RegisterMedicalIn, RegisterProfileIn, UserProfileUpdateBody } from '../../../../core/models/register-request.model';
import { CurrentUserMe } from '../../../../core/models/user-me.model';
import { CurrentUserService } from '../../../../core/services/current-user.service';
import { PredictionFormBuilderService } from '../../../prediction/services/prediction-form-builder.service';
import { formatAuthHttpError } from '../../../auth/utils/http-error.util';
import { isUnauthorizedHttpError } from '../../../../core/utils/http-unauthorized-status.util';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrl: './profile-home.component.scss'
})
export class ProfileHomeComponent implements OnInit {
  private readonly currentUser = inject(CurrentUserService);
  private readonly formBuilder = inject(PredictionFormBuilderService);

  readonly messages = PROFILE_MESSAGES;
  readonly pageUi = PROFILE_PAGE_UI;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly limits = VALIDATION_LIMITS;
  readonly removedTeethOptions = PREDICTION_REMOVED_TEETH_OPTIONS;
  readonly diabetesOptionsAll = PREDICTION_HAD_DIABETES_OPTIONS;

  readonly profileForm: FormGroup = this.formBuilder.createProfileUpdateGroup();
  readonly medicalForm: FormGroup = this.formBuilder.createMedicalGroup();

  emailDisplay: string | null = null;
  sexReadOnlyLabel = '';
  birthDateIso: string | null = null;
  private userSex: RegisterProfileIn['sex'] | null = null;

  get diabetesOptions(): readonly (typeof PREDICTION_HAD_DIABETES_OPTIONS)[number][] {
    if (this.userSex === 'Male') {
      return this.diabetesOptionsAll.filter((opt) => opt.value !== 'Yes, but only during pregnancy (female)');
    }
    return this.diabetesOptionsAll;
  }

  private profileBaseline: {
    height_meters: number | null;
    removed_teeth: RegisterProfileIn['removed_teeth'] | '';
  } | null = null;

  pageLoading = false;
  loadError: string | null = null;

  profileSaving = false;
  medicalSaving = false;

  profileSuccess: string | null = null;
  profileError: string | null = null;
  medicalSuccess: string | null = null;
  medicalError: string | null = null;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.pageLoading = true;
    this.loadError = null;
    this.clearSectionFeedbacks();
    this.currentUser.getMe().subscribe({
      next: (me) => this.applyUserToForms(me),
      error: (err: unknown) => {
        this.pageLoading = false;
        if (isUnauthorizedHttpError(err)) {
          return;
        }
        this.loadError =
          err instanceof Error && err.message === 'ME_RESPONSE_SHAPE'
            ? this.messages.loadParseError
            : formatAuthHttpError(err);
      }
    });
  }

  saveProfile(): void {
    this.profileSuccess = null;
    this.profileError = null;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const body = this.buildProfileUpdateBody();
    if (body == null) {
      this.profileError = this.messages.profileNoChanges;
      return;
    }
    this.profileSaving = true;
    this.currentUser
      .updateProfile(body)
      .pipe(finalize(() => (this.profileSaving = false)))
      .subscribe({
        next: () => {
          this.profileSuccess = this.messages.profileSaveSuccess;
          this.refreshProfileBaselineFromForm();
        },
        error: (err: unknown) => {
          if (isUnauthorizedHttpError(err)) {
            return;
          }
          this.profileError = formatAuthHttpError(err);
        }
      });
  }

  saveMedical(): void {
    this.medicalSuccess = null;
    this.medicalError = null;
    if (this.medicalForm.invalid) {
      this.medicalForm.markAllAsTouched();
      return;
    }
    const m = this.medicalForm.getRawValue() as Record<string, unknown>;
    const body: RegisterMedicalIn = {
      had_angina: Boolean(m['had_angina']),
      had_stroke: Boolean(m['had_stroke']),
      had_asthma: Boolean(m['had_asthma']),
      had_copd: Boolean(m['had_copd']),
      had_skin_cancer: Boolean(m['had_skin_cancer']),
      had_depressive_disorder: Boolean(m['had_depressive_disorder']),
      had_kidney_disease: Boolean(m['had_kidney_disease']),
      had_arthritis: Boolean(m['had_arthritis']),
      had_diabetes: m['had_diabetes'] as RegisterMedicalIn['had_diabetes'],
      deaf_or_hard_of_hearing: Boolean(m['deaf_or_hard_of_hearing']),
      blind_or_vision_difficulty: Boolean(m['blind_or_vision_difficulty']),
      difficulty_concentrating: Boolean(m['difficulty_concentrating']),
      difficulty_walking: Boolean(m['difficulty_walking']),
      difficulty_dressing_bathing: Boolean(m['difficulty_dressing_bathing']),
      difficulty_errands: Boolean(m['difficulty_errands'])
    };
    this.medicalSaving = true;
    this.currentUser
      .updateMedicalConditions(body)
      .pipe(finalize(() => (this.medicalSaving = false)))
      .subscribe({
        next: () => {
          this.medicalSuccess = this.messages.medicalSaveSuccess;
        },
        error: (err: unknown) => {
          if (isUnauthorizedHttpError(err)) {
            return;
          }
          this.medicalError = formatAuthHttpError(err);
        }
      });
  }

  private applyUserToForms(me: CurrentUserMe): void {
    this.emailDisplay = me.email ?? null;
    this.userSex = me.profile.sex;
    this.sexReadOnlyLabel = this.labelForSex(me.profile.sex);
    const bd = me.profile.birth_date;
    this.birthDateIso = bd && String(bd).trim() !== '' ? this.toDateInputValue(String(bd)) : null;

    const h =
      me.profile.height_meters !== null && me.profile.height_meters !== undefined
        ? Number(me.profile.height_meters)
        : null;
    const teeth = (me.profile.removed_teeth ?? 'None of them') as RegisterProfileIn['removed_teeth'];

    this.profileForm.patchValue({
      height_meters: h,
      removed_teeth: teeth
    });
    this.profileBaseline = {
      height_meters: Number.isFinite(h) ? h : null,
      removed_teeth: teeth
    };

    this.medicalForm.patchValue({
      had_angina: me.medical_conditions.had_angina,
      had_stroke: me.medical_conditions.had_stroke,
      had_asthma: me.medical_conditions.had_asthma,
      had_copd: me.medical_conditions.had_copd,
      had_skin_cancer: me.medical_conditions.had_skin_cancer,
      had_depressive_disorder: me.medical_conditions.had_depressive_disorder,
      had_kidney_disease: me.medical_conditions.had_kidney_disease,
      had_arthritis: me.medical_conditions.had_arthritis,
      had_diabetes: me.medical_conditions.had_diabetes,
      deaf_or_hard_of_hearing: me.medical_conditions.deaf_or_hard_of_hearing,
      blind_or_vision_difficulty: me.medical_conditions.blind_or_vision_difficulty,
      difficulty_concentrating: me.medical_conditions.difficulty_concentrating,
      difficulty_walking: me.medical_conditions.difficulty_walking,
      difficulty_dressing_bathing: me.medical_conditions.difficulty_dressing_bathing,
      difficulty_errands: me.medical_conditions.difficulty_errands
    });
    this.pageLoading = false;
    this.clearSectionFeedbacks();
  }

  private refreshProfileBaselineFromForm(): void {
    const raw = this.profileForm.getRawValue() as {
      height_meters: number | null;
      removed_teeth: RegisterProfileIn['removed_teeth'] | '';
    };
    const h = raw.height_meters !== null && raw.height_meters !== undefined ? Number(raw.height_meters) : null;
    this.profileBaseline = {
      height_meters: Number.isFinite(h) ? h : null,
      removed_teeth: raw.removed_teeth
    };
  }

  private buildProfileUpdateBody(): UserProfileUpdateBody | null {
    if (!this.profileBaseline) {
      return null;
    }
    const raw = this.profileForm.getRawValue() as {
      height_meters: number | null;
      removed_teeth: RegisterProfileIn['removed_teeth'] | '';
    };
    const hNow =
      raw.height_meters !== null && raw.height_meters !== undefined && Number.isFinite(Number(raw.height_meters))
        ? Number(raw.height_meters)
        : null;
    const base = this.profileBaseline;
    const body: UserProfileUpdateBody = {};

    if (!this.heightMetersEquals(hNow, base.height_meters)) {
      if (hNow != null) {
        body.height_meters = hNow;
      }
    }
    if (raw.removed_teeth !== base.removed_teeth) {
      body.removed_teeth = raw.removed_teeth as RegisterProfileIn['removed_teeth'];
    }
    return Object.keys(body).length > 0 ? body : null;
  }

  private heightMetersEquals(a: number | null, b: number | null): boolean {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return Math.abs(a - b) < 1e-5;
  }

  private labelForSex(sex: RegisterProfileIn['sex']): string {
    const found = PREDICTION_SEX_OPTIONS.find((o) => o.value === sex);
    return found?.label ?? sex;
  }

  private clearSectionFeedbacks(): void {
    this.profileSuccess = null;
    this.profileError = null;
    this.medicalSuccess = null;
    this.medicalError = null;
  }

  private toDateInputValue(isoOrDate: string): string {
    if (!isoOrDate) {
      return '';
    }
    return isoOrDate.length >= 10 ? isoOrDate.slice(0, 10) : isoOrDate;
  }
}
