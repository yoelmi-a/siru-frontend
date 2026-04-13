import { Component, ElementRef, ViewChild, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '@admin/services/department.service';
import { Department } from '@admin/interfaces/departments/department.interface';
import { SaveDepartment } from '@admin/interfaces/departments/save-department.interface';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { AppButton } from '@shared/components/app-button/app-button';
import { FormUtils } from '@utils/form-utils';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-department-create-modal',
  imports: [ReactiveFormsModule, FormErrorLabel, AppButton],
  templateUrl: './department-create-modal.html',
})
export class DepartmentCreateModal {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);

  isEdit = input<boolean>(false);
  departmentToEdit = input<Department | null>(null);

  created = output<void>();
  updated = output<void>();
  cancelled = output<void>();

  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  departmentForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
  });

  private buildPayload(): SaveDepartment {
    const formValue = this.departmentForm.getRawValue();

    return {
      name: formValue.name?.trim() ?? '',
    };
  }

  show() {
    this.errorMessage.set(null);

    if (this.isEdit() && this.departmentToEdit()) {
      this.departmentForm.patchValue({ name: this.departmentToEdit()!.name });
    } else {
      this.departmentForm.reset();
    }

    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.departmentForm.reset();
    this.errorMessage.set(null);
    this.cancelled.emit();
  }

  onSubmit() {
    this.departmentForm.markAllAsTouched();
    if (this.departmentForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    this.errorMessage.set(null);

    const payload = this.buildPayload();
    const current = this.departmentToEdit();

    const request$: Observable<void> = this.isEdit() && current
      ? this.departmentService.updateDepartment(current.id, payload)
      : this.departmentService.createDepartment(payload).pipe(map(() => undefined));

    request$.subscribe({
      next: () => {
        this.isPosting.set(false);
        this.dialog.nativeElement.close();
        this.departmentForm.reset();

        if (this.isEdit()) {
          this.updated.emit();
          return;
        }

        this.created.emit();
      },
      error: () => {
        this.isPosting.set(false);
        this.errorMessage.set(this.isEdit()
          ? 'No se pudo actualizar el departamento. Intenta nuevamente.'
          : 'No se pudo crear el departamento. Intenta nuevamente.');
      },
    });
  }
}
