import { CandidateCreateModal } from '@admin/components/candidate-create-modal/candidate-create-modal';
import { Candidate } from '@admin/interfaces/candidates/candidate.interface';
import { CandidateService } from '@admin/services/candidate.service';
import { Component, ViewChild, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminVacantsCard } from '@admin/components/admin-vacants-card/admin-vacants-card';
import { Card } from '@vacants/interfaces/card.interface';

@Component({
  selector: 'app-candidates-page',
  imports: [CandidateCreateModal, AdminVacantsCard],
  templateUrl: './candidates-page.html',
})
export class CandidatesPage {
  private candidateService = inject(CandidateService);

  @ViewChild('createCandidateModal') createCandidateModal!: CandidateCreateModal;

  candidatesResource = rxResource({
    stream: () => this.candidateService.getAllCandidates(),
  });

  candidatesList = computed<Candidate[]>(() => this.candidatesResource.value() ?? []);

  withCvCount = computed(() => this.candidatesList().filter((candidate) => !!candidate.cvUrl).length);

  candidateCards = computed<Card[]>(() => this.candidatesList().map((candidate) => ({
    Id: candidate.id,
    Title: `${candidate.names} ${candidate.lastNames}`,
    State: 'Candidato',
    Description: candidate.email,
    Tecnologies: [candidate.phoneNumber],
  })));

  onOpenCreateModal() {
    this.createCandidateModal.show();
  }

  onCreated() {
    this.candidatesResource.reload();
  }
}
