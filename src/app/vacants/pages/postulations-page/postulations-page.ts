import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PostulationService } from '@vacants/services/postulation.service';
import { DEV_CANDIDATE_STORAGE_KEY } from '../../../../utils/constants';

@Component({
  selector: 'app-postulations-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './postulations-page.html',
})
export class PostulationsPage {
  private postulationService = inject(PostulationService);

  // Auth esta deshabilitado por ahora; esta es la base para luego conectarlo al usuario autenticado.
  private candidateId = signal<string>(localStorage.getItem(DEV_CANDIDATE_STORAGE_KEY) ?? '');

  postulationsResource = rxResource({
    params: () => ({ candidateId: this.candidateId() }),
    stream: ({ params }) => {
      if (!params.candidateId) {
        return of([]);
      }

      return this.postulationService.getPostulationsByCandidate(params.candidateId);
    },
  });

  hasCandidateId = computed(() => this.candidateId().trim().length > 0);
  postulations = computed(() => this.postulationsResource.value() ?? []);
}
