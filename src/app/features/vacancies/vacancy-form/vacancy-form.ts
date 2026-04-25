import { Component, EventEmitter, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacantDto } from '@core/models/vacancy.models';
import { PositionDto } from '@core/models/position.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-vacancy-form',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './vacancy-form.html'
})
export class VacancyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  vacancy = input<VacantDto | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  positions = signal<PositionDto[]>([]);
  isPosting = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    profile: ['', [Validators.required]],
    status: ['Open'],
    positionId: [null as number | null]
  });

  ngOnInit() {
    const existing = this.vacancy();
    
    if (existing) {
      // Editing Mode
      this.form.get('status')?.setValidators([Validators.required]);
      this.form.patchValue({
        title: existing.title,
        description: existing.description,
        profile: existing.profile,
        status: existing.status
      });
    } else {
      // Creating Mode
      this.form.get('positionId')?.setValidators([Validators.required]);
      this.loadPositions();
    }
    
    this.form.updateValueAndValidity();
  }

  loadPositions() {
    this.api.getPositions().subscribe({
      next: (data) => this.positions.set(data),
      error: () => this.toast.error('Failed to load positions')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isPosting.set(true);
    const values = this.form.value;
    const existing = this.vacancy();

    if (existing) {
      this.api.updateVacancy(existing.id, {
        title: values.title!,
        description: values.description!,
        profile: values.profile!,
        status: values.status as 'Open' | 'Closed' | 'Cancelled'
      }).subscribe({
        next: () => {
          this.toast.success('Vacancy updated successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to update vacancy');
          this.isPosting.set(false);
        }
      });
    } else {
      this.api.createVacancy({
        title: values.title!,
        description: values.description!,
        profile: values.profile!,
        positionId: values.positionId!
      }).subscribe({
        next: () => {
          this.toast.success('Vacancy created successfully');
          this.isPosting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to create vacancy');
          this.isPosting.set(false);
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
