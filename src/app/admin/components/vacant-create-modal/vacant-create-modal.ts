import { Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VacantService } from '@admin/services/vacant.service';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { FormUtils } from '@utils/form-utils';
import { VacantGet } from '@admin/interfaces/vacants/vacantget.interface';
import { AppButton } from '@shared/components/app-button/app-button';

@Component({
  selector: 'app-vacant-create-modal',
  imports: [ReactiveFormsModule, FormErrorLabel, AppButton],
  templateUrl: './vacant-create-modal.html',
})
export class VacantCreateModal {
  private fb = inject(FormBuilder);
  private vacantService = inject(VacantService);

  isEdit = input<boolean>(false);
  vacantToEdit = input<VacantGet | null>(null);

  created = output<void>();
  updated = output<void>();
  cancelled = output<void>();

  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  createVacantForm = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    profile: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.pattern(FormUtils.notOnlySpacesPattern)]],
  });

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  private buildPayload() {
    const formValue = this.createVacantForm.getRawValue();
    const sourceVacant = this.vacantToEdit();

    return {
      id: sourceVacant?.id ?? '',
      title: formValue.title?.trim() ?? '',
      profile: formValue.profile?.trim() ?? '',
      description: formValue.description?.trim() ?? '',
      status: sourceVacant?.status ?? 0,
    };
  }

  show() {
    this.errorMessage.set(null);

    if (this.isEdit() && this.vacantToEdit()) {
      const vacant = this.vacantToEdit()!;
      this.createVacantForm.patchValue({
        title: vacant.title,
        profile: vacant.profile,
        description: vacant.description,
      });
    } else {
      this.createVacantForm.reset();
    }

    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.createVacantForm.reset();
    this.errorMessage.set(null);
    this.cancelled.emit();
  }

  onSubmit() {
    this.createVacantForm.markAllAsTouched();
    if (this.createVacantForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    this.errorMessage.set(null);

    const payload = this.buildPayload();

    const request$ = this.isEdit()
      ? this.vacantService.EditVacant(payload.id, payload)
      : this.vacantService.CreateVacant(payload);

    request$.subscribe({
      next: () => {
        this.isPosting.set(false);
        this.dialog.nativeElement.close();
        this.createVacantForm.reset();

        if (this.isEdit()) {
          this.updated.emit();
          return;
        }

        this.created.emit();
      },
      error: () => {
        this.isPosting.set(false);
        this.errorMessage.set(this.isEdit()
          ? 'No se pudo actualizar la vacante. Intenta nuevamente.'
          : 'No se pudo crear la vacante. Intenta nuevamente.');
      },
    });
  }
}
