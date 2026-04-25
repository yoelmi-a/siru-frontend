import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacantDto } from '@core/models/vacancy.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-vacancy-apply',
  imports: [ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './vacancy-apply.html'
})
export class VacancyApplyPage implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vacancy = signal<VacantDto | null>(null);
  loading = signal(true);
  isSubmitting = signal(false);
  selectedFile = signal<File | null>(null);

  form = this.fb.group({
    candidateNames: ['', [Validators.required]],
    candidateLastNames: ['', [Validators.required]],
    candidateEmail: ['', [Validators.required, Validators.email]],
    candidatePhoneNumber: ['', [Validators.required]],
    cvFileName: ['', [Validators.required]] // Dummy control for validation UI
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVacancy(id);
    } else {
      this.router.navigate(['/vacancies']);
    }
  }

  loadVacancy(id: string) {
    this.api.getVacancy(id).subscribe({
      next: (data) => {
        if (data.status !== 'Open') {
          this.toast.error('This vacancy is no longer accepting applications.');
          this.router.navigate(['/vacancies', id]);
          return;
        }
        this.vacancy.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error('Vacancy not found');
        } else {
          this.toast.error('Failed to load vacancy details');
        }
        this.router.navigate(['/vacancies']);
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type (must be PDF)
      if (file.type !== 'application/pdf') {
        this.toast.error('Only PDF files are allowed');
        this.clearFile(input);
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toast.error('File size cannot exceed 10MB');
        this.clearFile(input);
        return;
      }

      this.selectedFile.set(file);
      this.form.patchValue({ cvFileName: file.name });
      this.form.get('cvFileName')?.markAsTouched();
    } else {
      this.clearFile(input);
    }
  }

  private clearFile(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.selectedFile.set(null);
    this.form.patchValue({ cvFileName: '' });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const file = this.selectedFile();
    const vacancyId = this.vacancy()?.id;
    if (!file || !vacancyId) return;

    this.isSubmitting.set(true);
    const values = this.form.value;

    this.api.applyToVacancy(vacancyId, {
      candidateNames: values.candidateNames!,
      candidateLastNames: values.candidateLastNames!,
      candidateEmail: values.candidateEmail!,
      candidatePhoneNumber: values.candidatePhoneNumber!,
      cvFile: file
    }).subscribe({
      next: () => {
        this.toast.success('Application submitted successfully!');
        this.isSubmitting.set(false);
        this.router.navigate(['/vacancies', vacancyId]);
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to submit application');
        this.isSubmitting.set(false);
      }
    });
  }
}
