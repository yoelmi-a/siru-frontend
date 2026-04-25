import { Account, EditAccount } from '@admin/interfaces/account.interface';
import { AccountService } from '@admin/services/account.service';
import { Component, effect, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Role } from '@auth/services/auth.service';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { MobileError } from '@shared/components/mobile-error/mobile-error';
import { DesktopError } from "@shared/components/desktop-error/desktop-error";
import { PhoneMaskDirective } from "@admin/directives/phone-mask.directive";

const roles = [
  { value: Role.ADMIN, label: 'Administrador' },
  { value: Role.SUPERVISOR, label: 'Supervisor' },
]

@Component({
  selector: 'user-form',
  imports: [RouterLink, ReactiveFormsModule, FormErrorLabel, DesktopError, MobileError, PhoneMaskDirective],
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {
  roles = [
    { value: Role.ADMIN, label: 'Administrador' },
    { value: Role.SUPERVISOR, label: 'Supervisor' },
  ];

  account = input.required<Account>();
  id = input<string>();
  isEditMode = input.required<boolean>();
  fb = inject(FormBuilder);
  router = inject(Router);
  accountService = inject(AccountService);

  hasError = signal(false);
  isPosting = signal(false);
  errorMessage = this.accountService.errorMessage;
  @ViewChild('errorModal') mobileErrorModal!: MobileError;

  accountForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();

    if (this.isEditMode()) {
      this.accountForm.patchValue(this.account());
    }
  }

  private buildForm() {
    const baseControls = {
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      phoneNumber: ['', [Validators.maxLength(10), Validators.pattern(FormUtils.dominicanPhonePattern)]],
      email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    };

    if (this.isEditMode()) {
      this.accountForm = this.fb.group(baseControls);
    } else {
      this.accountForm = this.fb.group({
        ...baseControls,
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(FormUtils.notOnlySpacesPattern),
          Validators.pattern(FormUtils.upperAndLowerPattern),
          Validators.pattern(FormUtils.hasNumberPattern),
          Validators.pattern(FormUtils.hasSpecialPattern),
        ]],
        confirmPassword: ['', [Validators.required]],
      }, {
        validators: [FormUtils.arePasswordsEqual('password', 'confirmPassword')]
      });
    }
  }

  constructor() {
    effect(() => {
      if (this.hasError()) {
        this.openModal();
      }
    });
  }


  openModal() {
    if (window.innerWidth < 768 && this.mobileErrorModal) {
      this.mobileErrorModal.show();
      this.hasError.set(false);
    }
  }

  onSubmit() {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.invalid) {
      return;
    }

    this.isPosting.set(true);

    if (this.isEditMode()) {
      const editAccount: EditAccount = {
        ...this.accountForm.value,
        id: this.id()
      };

      this.accountService.edit(editAccount).subscribe((isSuccess) => {
        if (isSuccess) {
          this.router.navigateByUrl('/admin/users');
        }

        this.hasError.set(true);
        this.isPosting.set(false);
        setTimeout(() => {
          this.hasError.set(false);
        }, 5000);
      });
    } else {
      this.accountService.register(this.accountForm.value as Account).subscribe((isSuccess) => {
        if (isSuccess) {
          this.router.navigateByUrl('/admin/users');
        }

        this.hasError.set(true);
        this.isPosting.set(false);
        setTimeout(() => {
          this.hasError.set(false);
        }, 5000);
      });
    }
  }
}