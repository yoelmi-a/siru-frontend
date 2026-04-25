import { Component, EventEmitter, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { DepartmentDto } from '@core/models/department.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './department-form.html'
})
export class DepartmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  department = input<DepartmentDto | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  isPosting = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required]]
  });

  ngOnInit() {
    const existing = this.department();
    if (existing) {
      this.form.patchValue({
        name: existing.name
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isPosting.set(true);
    const values = this.form.value;
    const existing = this.department();

    if (existing) {
      this.api.updateDepartment(existing.id, {
        name: values.name!
      }).subscribe({
        next: () => {
          this.toast.success('Department updated successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to update department');
          this.isPosting.set(false);
        }
      });
    } else {
      this.api.createDepartment({
        name: values.name!
      }).subscribe({
        next: () => {
          this.toast.success('Department created successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to create department');
          this.isPosting.set(false);
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}