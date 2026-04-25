import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CriterionDto } from '@core/models/evaluation.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-criterion-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './criterion-form-modal.html'
})
export class CriterionFormModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  criterion = input<CriterionDto | null>(null);
  saved = output<void>();
  closed = output<void>();

  isSubmitting = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required]]
  });

  ngOnInit() {
    const existing = this.criterion();
    if (existing) {
      this.form.patchValue({
        name: existing.name
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const values = this.form.value;
    const existing = this.criterion();

    if (existing) {
      this.api.updateCriterion(existing.id, { name: values.name! }).subscribe({
        next: () => {
          this.toast.success('Criterion updated successfully');
          this.saved.emit();
        },
        error: (err) => {
          if (err.status === 409) {
            this.toast.error('A criterion with this name already exists');
          } else {
            this.toast.error(err.error?.detail || 'Failed to update criterion');
          }
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.api.createCriterion({ name: values.name! }).subscribe({
        next: () => {
          this.toast.success('Criterion created successfully');
          this.saved.emit();
        },
        error: (err) => {
          if (err.status === 409) {
            this.toast.error('A criterion with this name already exists');
          } else {
            this.toast.error(err.error?.detail || 'Failed to create criterion');
          }
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
