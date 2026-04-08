import { Component, ElementRef, inject, signal, ViewChild, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DesktopError } from '@shared/components/desktop-error/desktop-error';
import { MobileError } from '@shared/components/mobile-error/mobile-error';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';


@Component({
  selector: 'login-page',
  imports: [ReactiveFormsModule, DesktopError, MobileError, RouterLink, FormErrorLabel],
  templateUrl: './login-page.html'
})
export class LoginPage {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = this.authService.errorMessage;
  @ViewChild('errorModal') mobileErrorModal!: MobileError;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required]]
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
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isPosting.set(true);

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        switch (isAuthenticated) {
          case (this.authService.hasClerkPermission()):
            this.router.navigateByUrl('/clerk/home');
            return;

          case (this.authService.hasDeliveryPermission()):
            this.router.navigateByUrl('/delivery/home');
            return;

          default:
            this.router.navigateByUrl('/admin/home');
            return;
        }
      }

      this.hasError.set(true);
      this.isPosting.set(false);
      setTimeout(() => {
        this.hasError.set(false);
      }, 5000);
    })
  }
}
