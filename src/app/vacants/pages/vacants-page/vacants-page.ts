import { Component, computed, inject, signal } from '@angular/core';
import { VacantsCard } from '@vacants/components/vacants-card/vacants-card.component';
import { Card } from '@vacants/interfaces/card.interface';
import { Header } from '@vacants/interfaces/header.interface';
import { VacantsHeaderComponent } from '@vacants/components/vacants-header/vacants-header.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { PublicVacantsService } from '@vacants/services/public-vacants.service';
import { PostulationService } from '@vacants/services/postulation.service';
import { AuthService } from '@auth/services/auth.service';
import { DEV_CANDIDATE_STORAGE_KEY } from '../../../../utils/constants';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-vacants-page',
  imports: [VacantsCard, VacantsHeaderComponent, NgClass],
  templateUrl: './vacants-page.html',
})
export class VacantsPage {
  private publicVacantsService = inject(PublicVacantsService);
  private postulationService = inject(PostulationService);
  private authService = inject(AuthService);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  header = signal<Header>({
    Title: 'Encuentra tu proximo reto',
    Description: 'Explora vacantes reales publicadas en nuestra plataforma.',
  });

  applyFeedback = signal<string | null>(null);
  isApplying = signal(false);

  vacantsResource = rxResource({
    stream: () => this.publicVacantsService.getAllVacants(),
  });

  cards = computed<Card[]>(() => {
    const vacants = this.vacantsResource.value() ?? [];

    return vacants.map((vacant) => ({
      Id: vacant.id,
      Title: vacant.title,
      State: vacant.status === 0 ? 'Activa' : 'Inactiva',
      Description: vacant.description,
      Tecnologies: vacant.profile
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    }));
  });

  onApply(vacantId: string) {
    if (this.isApplying()) {
      return;
    }

    // Verificar autenticación (aunque guards estén deshabilitados, la lógica debe existir)
    if (!this.isAuthenticated()) {
      this.applyFeedback.set('Debes iniciar sesión para postularte. Por ahora, configura ' + DEV_CANDIDATE_STORAGE_KEY + ' en localStorage para pruebas.');
      return;
    }

    const candidateId = localStorage.getItem(DEV_CANDIDATE_STORAGE_KEY) ?? '';
    if (!candidateId) {
      this.applyFeedback.set('Configura ' + DEV_CANDIDATE_STORAGE_KEY + ' en localStorage para simular postulaciones sin login.');
      return;
    }

    this.isApplying.set(true);
    this.applyFeedback.set(null);

    this.postulationService.createPostulation({
      candidateId,
      vacantId,
    }).subscribe({
      next: () => {
        this.isApplying.set(false);
        this.applyFeedback.set('Postulacion registrada correctamente.');
      },
      error: () => {
        this.isApplying.set(false);
        this.applyFeedback.set('No se pudo registrar la postulacion. Verifica el endpoint de Postulations.');
      },
    });
  }
}
