import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { DesktopError } from '@shared/components/desktop-error/desktop-error';
import { MobileError } from '@shared/components/mobile-error/mobile-error';
import { ResetPasswordSuccess } from "@auth/components/reset-password-success/reset-password-success";
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, DesktopError, MobileError, RouterLink, ResetPasswordSuccess, FormErrorLabel],
  templateUrl: './reset-password-page.html',
})
export class ResetPasswordPage {
  private route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  isSuccess = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = this.authService.errorMessage;
  @ViewChild('errorModal') mobileErrorModal!: MobileError;

  accountId = this.route.snapshot.queryParamMap.get('accountId');
  token = this.route.snapshot.queryParamMap.get('token');

  resetPasswordForm = this.fb.group({
    password: ['',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(FormUtils.hasNumberPattern),
        Validators.pattern(FormUtils.hasSpecialPattern),
        Validators.pattern(FormUtils.upperAndLowerPattern)
      ]],
    confirmPassword: ['', [Validators.required]]
  },{
    validators: [FormUtils.arePasswordsEqual('password', 'confirmPassword')]
  });

  constructor() {
    effect(() => {
      if (this.hasError()) {
        this.openModal();
      }
    });
  }

  openModal() {
    // El método nativo de los elementos <dialog> es showModal()
      if (window.innerWidth < 768 && this.mobileErrorModal) {
      this.mobileErrorModal.show();
      this.hasError.set(false);
    }
  }

  onSubmit() {
    this.resetPasswordForm.markAllAsTouched();
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    const { confirmPassword: confirmpassword = '', password = '' } = this.resetPasswordForm.value;

    this.authService.resetPassword(password!, this.accountId ?? "", this.token ?? "").subscribe((isSuccess) => {
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
