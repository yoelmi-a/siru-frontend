import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'login-page',
  imports: [ReactiveFormsModule, RouterLink, FormErrorLabel],
  templateUrl: './login-page.html'
})
export class LoginPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);

  isPosting = signal(false);
  errorMessage = this.authService.errorMessage;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isPosting.set(true);

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (success) => {
        this.isPosting.set(false);
        if (success) {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        this.isPosting.set(false);
        this.toast.error(err.error?.detail || err.error?.title || 'Login failed');
      }
    });
  }
}