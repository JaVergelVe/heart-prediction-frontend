import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { APP_ROUTE_URLS } from '../../../../core/constants/route-urls.constant';
import { VALIDATION_MESSAGES } from '../../../../core/constants/messages/validation-messages.constant';
import { LOGIN_PAGE_UI } from '../../../../core/constants/ui/auth-login-ui.constant';
import { VALIDATION_LIMITS } from '../../../../core/constants/validation-limits.constant';
import { AuthService } from '../../../../core/services/auth.service';
import { formatLoginHttpError } from '../../utils/http-error.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly limits = VALIDATION_LIMITS;
  readonly validationMessages = VALIDATION_MESSAGES;
  readonly ui = LOGIN_PAGE_UI;
  showPassword = false;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(this.limits.passwordMinLogin),
        Validators.maxLength(this.limits.passwordMax)
      ]
    ]
  });

  submitting = false;
  serverError: string | null = null;

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.submitting = true;
    this.auth
      .login(email.trim(), password)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.router.navigateByUrl(APP_ROUTE_URLS.predictionsAuthenticated),
        error: (err) => {
          this.serverError = formatLoginHttpError(err);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
