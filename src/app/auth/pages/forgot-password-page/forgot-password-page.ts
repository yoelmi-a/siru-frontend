import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { DesktopError } from '@shared/components/desktop-error/desktop-error';
import { MobileError } from '@shared/components/mobile-error/mobile-error';
import { FogotPasswordSuccess } from "@auth/components/fogot-password-success/fogot-password-success";
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, DesktopError, MobileError, RouterLink, FogotPasswordSuccess, FormErrorLabel],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  isSuccess = signal(false);
  authService = inject(AuthService);
  errorMessage = this.authService.errorMessage;
  @ViewChild('errorModal') mobileErrorModal!: MobileError;

  constructor() {
    effect(() => {
      if (this.hasError()) {
        this.openModal();
      }
    });
  }

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]]
  });

  openModal() {
    // El método nativo de los elementos <dialog> es showModal()
    if (window.innerWidth < 768 && this.mobileErrorModal) {
      this.mobileErrorModal.show();
      this.hasError.set(false);
    }
  }

  onSubmit() {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    const { email = '', } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email!).subscribe((isSuccess) => {
      if (isSuccess) {
        this.isSuccess.set(true);
        return;
      }

      this.hasError.set(true);
      this.isPosting.set(false);
      setTimeout(() => {
        this.hasError.set(false);
      }, 5000);
    })
  }
}
