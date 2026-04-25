import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { PositionDto } from '@core/models/position.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-assign-position-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './assign-position-modal.html'
})
export class AssignPositionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  employeeId = input.required<string>();
  assigned = output<void>();
  closed = output<void>();

  positions = signal<PositionDto[]>([]);
  isSubmitting = signal(false);

  form = this.fb.group({
    positionId: ['', [Validators.required]],
    startDate: [new Date().toISOString().split('T')[0], [Validators.required]]
  });

  ngOnInit() {
    this.api.getPositions().subscribe({
      next: (data) => this.positions.set(data),
      error: () => this.toast.error('Failed to load positions')
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const values = this.form.value;

    this.api.assignPosition(this.employeeId(), {
      employeeId: this.employeeId(),
      positionId: Number(values.positionId),
      startDate: new Date(values.startDate!).toISOString()
    }).subscribe({
      next: () => {
        this.toast.success('Position assigned successfully');
        this.isSubmitting.set(false);
        this.assigned.emit();
      }, 
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to assign position');
        this.isSubmitting.set(false);
      }
    });
  }
}
