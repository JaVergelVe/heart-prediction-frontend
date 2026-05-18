import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  REGISTER_DIABETES_OPTION_ITEMS,
  REGISTER_REMOVED_TEETH_OPTION_ITEMS,
  REGISTER_SEX_OPTIONS
} from '../../../../core/constants/data/register-api-options.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { REGISTER_PAGE_UI } from '../../../../core/constants/ui/auth-register-ui.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import {
  birthDateMinimumAgeValidator,
  birthDateNotInFutureValidator
} from '../../../../core/validators/birth-date-not-in-future.validator';
import {
  RegisterMedicalIn,
  RegisterProfileIn,
  RegisterRequestBody
} from '../../../../core/models/register-request.model';
import { AuthService } from '../../../../core/services/auth.service';
import { formatAuthHttpError } from '../../utils/http-error.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly ui = REGISTER_PAGE_UI;
  readonly limits = VALIDATION_LIMITS;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly removedTeethOptions = REGISTER_REMOVED_TEETH_OPTION_ITEMS;
  readonly diabetesOptionsAll = REGISTER_DIABETES_OPTION_ITEMS;
  readonly sexOptions = REGISTER_SEX_OPTIONS;
  showPassword = false;

  get maxBirthDate(): Date {
    return new Date();
  }

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(this.limits.passwordMinRegister), Validators.maxLength(this.limits.passwordMax)]
    ],
    profile: this.fb.group({
      sex: ['' as RegisterProfileIn['sex'] | '', [Validators.required]],
      birth_date: [null as Date | null, [Validators.required, birthDateNotInFutureValidator(), birthDateMinimumAgeValidator(18)]],
      height_meters: [
        null as number | null,
        [Validators.required, Validators.min(this.limits.heightMetersMin), Validators.max(this.limits.heightMetersMax)]
      ],
      removed_teeth: ['' as RegisterProfileIn['removed_teeth'] | '', [Validators.required]]
    }),
    medical_conditions: this.fb.group({
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
    })
  });

  submitting = false;
  serverError: string | null = null;

  constructor() {
    const sexControl = this.form.controls.profile.controls.sex;
    sexControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((sex) => {
      this.enforceDiabetesOptionBySex(sex ?? '');
    });
  }

  get diabetesOptions(): readonly (typeof REGISTER_DIABETES_OPTION_ITEMS)[number][] {
    const sex = this.form.controls.profile.controls.sex.value;
    if (sex === 'Male') {
      return this.diabetesOptionsAll.filter((opt) => opt.value !== 'Yes, but only during pregnancy (female)');
    }
    return this.diabetesOptionsAll;
  }

  /** Avance visual del formulario (solo presentación). */
  get registerProgressPercent(): number {
    const total = 7;
    let filled = 0;
    const { email, password, profile, medical_conditions } = this.form.controls;
    if ((email.value ?? '').trim()) {
      filled++;
    }
    if (password.value) {
      filled++;
    }
    if (profile.controls.sex.value) {
      filled++;
    }
    if (profile.controls.birth_date.value) {
      filled++;
    }
    if (profile.controls.height_meters.value != null) {
      filled++;
    }
    if (profile.controls.removed_teeth.value) {
      filled++;
    }
    if (medical_conditions.controls.had_diabetes.value) {
      filled++;
    }
    return Math.round((filled / total) * 100);
  }

  get registerProgressStepLabel(): string {
    if (!this.isRegisterAccountSectionFilled()) {
      return 'Paso 1 de 3';
    }
    if (!this.isRegisterProfileSectionFilled()) {
      return 'Paso 2 de 3';
    }
    return 'Paso 3 de 3';
  }

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body = this.buildRequestBody();
    this.submitting = true;
    this.auth
      .register(body)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigateByUrl(APP_ROUTE_URLS.predictionsAuthenticated),
        error: (err) => {
          if (this.applyUnderageErrorIfPresent(err)) {
            return;
          }
          this.serverError = formatAuthHttpError(err);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private isRegisterAccountSectionFilled(): boolean {
    const { email, password } = this.form.controls;
    return Boolean((email.value ?? '').trim() && password.value);
  }

  private isRegisterProfileSectionFilled(): boolean {
    const p = this.form.controls.profile.controls;
    return Boolean(
      p.sex.value &&
        p.birth_date.value &&
        p.height_meters.value != null &&
        p.removed_teeth.value
    );
  }

  private enforceDiabetesOptionBySex(sex: RegisterProfileIn['sex'] | ''): void {
    if (sex !== 'Male') {
      return;
    }
    const diabetesControl = this.form.controls.medical_conditions.controls.had_diabetes;
    if (diabetesControl.value === 'Yes, but only during pregnancy (female)') {
      diabetesControl.setValue('No');
      diabetesControl.markAsDirty();
    }
  }

  private applyUnderageErrorIfPresent(err: unknown): boolean {
    if (!(err instanceof HttpErrorResponse)) {
      return false;
    }
    const detail = err.error?.detail;
    const detailItems = Array.isArray(detail) ? detail : [];
    const underageByList = detailItems.some((d: { loc?: unknown; msg?: string }) => {
      const loc = Array.isArray(d?.loc) ? d.loc.map((x) => String(x).toLowerCase()) : [];
      const targetsBirthDate = loc.includes('birth_date');
      const msg = String(d?.msg ?? '').toLowerCase();
      const saysUnderage = msg.includes('18') || msg.includes('adult') || msg.includes('minor');
      return targetsBirthDate && saysUnderage;
    });
    const detailText = typeof detail === 'string' ? detail.toLowerCase() : '';
    const underageByText =
      detailText.includes('birth') &&
      (detailText.includes('18') || detailText.includes('adult') || detailText.includes('minor'));
    if (!underageByList && !underageByText) {
      return false;
    }
    const birthDateControl = this.form.controls.profile.controls.birth_date;
    birthDateControl.setErrors({ ...(birthDateControl.errors ?? {}), birthDateUnderage: true });
    birthDateControl.markAsTouched();
    this.serverError = null;
    return true;
  }

  private buildRequestBody(): RegisterRequestBody {
    const v = this.form.getRawValue();
    const p = v.profile;
    const m = v.medical_conditions;
    const birth = p.birth_date;
    const birthIso =
      birth instanceof Date && !Number.isNaN(birth.getTime()) ? formatDate(birth, 'yyyy-MM-dd', 'es') : '';
    return {
      email: (v.email ?? '').trim(),
      password: v.password as string,
      profile: {
        sex: p.sex as RegisterProfileIn['sex'],
        birth_date: birthIso as RegisterProfileIn['birth_date'],
        height_meters: Number(p.height_meters),
        removed_teeth: p.removed_teeth as RegisterProfileIn['removed_teeth']
      },
      medical_conditions: {
        had_angina: m.had_angina,
        had_stroke: m.had_stroke,
        had_asthma: m.had_asthma,
        had_copd: m.had_copd,
        had_skin_cancer: m.had_skin_cancer,
        had_depressive_disorder: m.had_depressive_disorder,
        had_kidney_disease: m.had_kidney_disease,
        had_arthritis: m.had_arthritis,
        had_diabetes: m.had_diabetes as RegisterMedicalIn['had_diabetes'],
        deaf_or_hard_of_hearing: m.deaf_or_hard_of_hearing,
        blind_or_vision_difficulty: m.blind_or_vision_difficulty,
        difficulty_concentrating: m.difficulty_concentrating,
        difficulty_walking: m.difficulty_walking,
        difficulty_dressing_bathing: m.difficulty_dressing_bathing,
        difficulty_errands: m.difficulty_errands
      }
    };
  }
}
