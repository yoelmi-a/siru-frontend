import { Component, ElementRef, ViewChild, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionService } from '@admin/services/position.service';
import { Position } from '@admin/interfaces/positions/position.interface';
import { SavePosition } from '@admin/interfaces/positions/save-position.interface';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { AppButton } from '@shared/components/app-button/app-button';
import { FormUtils } from '@utils/form-utils';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-position-create-modal',
  imports: [ReactiveFormsModule, FormErrorLabel, AppButton],
  templateUrl: './position-create-modal.html',
})
export class PositionCreateModal {
  private fb = inject(FormBuilder);
  private positionService = inject(PositionService);

  isEdit = input<boolean>(false);
  positionToEdit = input<Position | null>(null);

  created = output<void>();
  updated = output<void>();
  cancelled = output<void>();

  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  positionForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    salary: [0, [Validators.required, Validators.min(0)]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
  });

  private buildPayload(): SavePosition {
    const formValue = this.positionForm.getRawValue();

    return {
      name: formValue.name?.trim() ?? '',
      salary: Number(formValue.salary ?? 0),
      departmentId: Number(formValue.departmentId ?? 0),
    };
  }

  show() {
    this.errorMessage.set(null);

    if (this.isEdit() && this.positionToEdit()) {
      const position = this.positionToEdit()!;
      this.positionForm.patchValue({
        name: position.name,
        salary: position.salary,
        departmentId: position.departmentId,
      });
    } else {
      this.positionForm.reset({
        name: '',
        salary: 0,
        departmentId: 0,
      });
    }

    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.positionForm.reset();
    this.errorMessage.set(null);
    this.cancelled.emit();
  }

  onSubmit() {
    this.positionForm.markAllAsTouched();
    if (this.positionForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    this.errorMessage.set(null);

    const payload = this.buildPayload();
    const current = this.positionToEdit();

    const request$: Observable<void> = this.isEdit() && current
      ? this.positionService.updatePosition(current.id, payload)
      : this.positionService.createPosition(payload).pipe(map(() => undefined));

    request$.subscribe({
      next: () => {
        this.isPosting.set(false);
        this.dialog.nativeElement.close();
        this.positionForm.reset();

        if (this.isEdit()) {
          this.updated.emit();
          return;
        }

        this.created.emit();
      },
      error: () => {
        this.isPosting.set(false);
        this.errorMessage.set(this.isEdit()
          ? 'No se pudo actualizar el puesto. Intenta nuevamente.'
          : 'No se pudo crear el puesto. Intenta nuevamente.');
      },
    });
  }
}
