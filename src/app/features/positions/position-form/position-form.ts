import { Component, EventEmitter, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { PositionDto } from '@core/models/position.models';
import { DepartmentDto } from '@core/models/department.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-position-form',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './position-form.html'
})
export class PositionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  position = input<PositionDto | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  departments = signal<DepartmentDto[]>([]);
  isPosting = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required]],
    salary: [null as number | null, [Validators.required, Validators.min(1)]],
    departmentId: [null as number | null, [Validators.required]]
  });

  ngOnInit() {
    this.loadDepartments();

    const existing = this.position();
    if (existing) {
      this.form.patchValue({
        name: existing.name,
        salary: existing.salary,
        departmentId: existing.departmentId
      });
    }
  }

  loadDepartments() {
    this.api.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: () => this.toast.error('Failed to load departments')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isPosting.set(true);
    const values = this.form.value;
    const existing = this.position();

    if (existing) {
      this.api.updatePosition(existing.id, {
        name: values.name!,
        salary: values.salary!,
        departmentId: values.departmentId!
      }).subscribe({
        next: () => {
          this.toast.success('Position updated successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to update position');
          this.isPosting.set(false);
        }
      });
    } else {
      this.api.createPosition({
        name: values.name!,
        salary: values.salary!,
        departmentId: values.departmentId!
      }).subscribe({
        next: () => {
          this.toast.success('Position created successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to create position');
          this.isPosting.set(false);
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}