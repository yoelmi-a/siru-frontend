import { Component, ElementRef, ViewChild, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateService } from '@admin/services/candidate.service';
import { Candidate } from '@admin/interfaces/candidates/candidate.interface';
import { SaveCandidate } from '@admin/interfaces/candidates/save-candidate.interface';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { AppButton } from '@shared/components/app-button/app-button';
import { FormUtils } from '@utils/form-utils';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-candidate-create-modal',
  imports: [ReactiveFormsModule, FormErrorLabel, AppButton],
  templateUrl: './candidate-create-modal.html',
})
export class CandidateCreateModal {
  private fb = inject(FormBuilder);
  private candidateService = inject(CandidateService);

  isEdit = input<boolean>(false);
  candidateToEdit = input<Candidate | null>(null);

  created = output<void>();
  updated = output<void>();
  cancelled = output<void>();

  isPosting = signal(false);
  errorMessage = signal<string | null>(null);
  isUploadingCv = signal(false);

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  candidateForm = this.fb.group({
    names: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    lastNames: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.dominicanPhonePattern)]],
    cvUrl: ['', [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]],
  });

  private buildPayload(): SaveCandidate {
    const formValue = this.candidateForm.getRawValue();
    const source = this.candidateToEdit();

    return {
      id: source?.id ?? '',
      names: formValue.names?.trim() ?? '',
      lastNames: formValue.lastNames?.trim() ?? '',
      email: formValue.email?.trim() ?? '',
      phoneNumber: formValue.phoneNumber?.trim() ?? '',
      cvUrl: formValue.cvUrl?.trim() ?? '',
    };
  }

  onFakeUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    this.isUploadingCv.set(true);

    // Simulated parsing delay (AI Analysis)
    setTimeout(() => {
      this.candidateForm.patchValue({
        names: 'Ana María',
        lastNames: 'López Domínguez',
        email: 'ana.lopez.dev@ejemplo.com',
        phoneNumber: '8095551234',
        cvUrl: 'https://ejemplo.com/storage/cv_ana_lopez_2026.pdf',
      });
      this.isUploadingCv.set(false);
      target.value = ''; // reset file input
    }, 2500);
  }

  show() {
    this.errorMessage.set(null);

    if (this.isEdit() && this.candidateToEdit()) {
      const candidate = this.candidateToEdit()!;
      this.candidateForm.patchValue({
        names: candidate.names,
        lastNames: candidate.lastNames,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        cvUrl: candidate.cvUrl,
      });
    } else {
      this.candidateForm.reset();
    }

    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.candidateForm.reset();
    this.errorMessage.set(null);
    this.cancelled.emit();
  }

  onSubmit() {
    this.candidateForm.markAllAsTouched();
    if (this.candidateForm.invalid) {
      return;
    }

    this.isPosting.set(true);
    this.errorMessage.set(null);

    const payload = this.buildPayload();

    const request$: Observable<void> = this.isEdit()
      ? this.candidateService.updateCandidate(payload.id, payload)
      : this.candidateService.createCandidate(payload).pipe(map(() => undefined));

    request$.subscribe({
      next: () => {
        this.isPosting.set(false);
        this.dialog.nativeElement.close();
        this.candidateForm.reset();

        if (this.isEdit()) {
          this.updated.emit();
          return;
        }

        this.created.emit();
      },
      error: () => {
        this.isPosting.set(false);
        this.errorMessage.set(this.isEdit()
          ? 'No se pudo actualizar el candidato. Intenta nuevamente.'
          : 'No se pudo crear el candidato. Intenta nuevamente.');
      },
    });
  }
}
