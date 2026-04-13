import { CandidateCreateModal } from '@admin/components/candidate-create-modal/candidate-create-modal';
import { Candidate } from '@admin/interfaces/candidates/candidate.interface';
import { CandidateService } from '@admin/services/candidate.service';
import { CvAnalysisService } from '@admin/services/cv-analysis.service';
import { Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-candidate-details-page',
  imports: [RouterLink, CandidateCreateModal],
  templateUrl: './candidate-details.page.html',
})
export class CandidateDetailsPage {
  private candidateService = inject(CandidateService);
  private cvAnalysisService = inject(CvAnalysisService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('editCandidateModal') editCandidateModal!: CandidateCreateModal;

  candidateId = toSignal<string>(this.activatedRoute.params.pipe(map((params) => params['id'])));
  isDeleting = signal(false);

  candidateResource = rxResource({
    params: () => ({ id: this.candidateId() }),
    stream: ({ params }) => this.candidateService.getCandidateById(params.id ?? ''),
  });

  candidate = computed<Candidate | null>(() => this.candidateResource.value() ?? null);

  // IA Analysis Data
  isAnalyzingCv = signal(false);
  cvAnalysisData = signal<any>(null);

  redirectEffect = effect(() => {
    if (this.candidateResource.error()) {
      this.router.navigateByUrl('/admin/candidates');
    }
  });

  onOpenEditModal() {
    this.editCandidateModal.show();
  }

  onUpdated() {
    this.candidateResource.reload();
  }

  analyzeCV() {
    if (this.isAnalyzingCv() || !this.candidate()) return;
    
    this.isAnalyzingCv.set(true);
    // Simulating file since it's just fake data
    const fakeFile = new File([''], 'cv.pdf', { type: 'application/pdf' });
    this.cvAnalysisService.uploadAndAnalyzeCv(this.candidate()!.id, fakeFile).subscribe(res => {
      this.cvAnalysisData.set(res.extractedData);
      this.isAnalyzingCv.set(false);
    });
  }

  onDelete() {
    const candidate = this.candidate();
    if (!candidate || this.isDeleting()) {
      return;
    }

    const shouldDelete = window.confirm('Esta accion eliminara el candidato. Deseas continuar?');
    if (!shouldDelete) {
      return;
    }

    this.isDeleting.set(true);

    this.candidateService.deleteCandidate(candidate.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.router.navigateByUrl('/admin/candidates');
      },
      error: () => this.isDeleting.set(false),
    });
  }
}
