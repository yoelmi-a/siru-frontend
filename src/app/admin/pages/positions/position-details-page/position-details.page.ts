import { PositionCreateModal } from '@admin/components/position-create-modal/position-create-modal';
import { Position } from '@admin/interfaces/positions/position.interface';
import { PositionService } from '@admin/services/position.service';
import { Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-position-details-page',
  imports: [RouterLink, PositionCreateModal],
  templateUrl: './position-details.page.html',
})
export class PositionDetailsPage {
  private positionService = inject(PositionService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('editPositionModal') editPositionModal!: PositionCreateModal;

  positionId = toSignal<string>(this.activatedRoute.params.pipe(map((params) => params['id'])));
  isDeleting = signal(false);

  positionResource = rxResource({
    params: () => ({ id: Number(this.positionId() ?? 0) }),
    stream: ({ params }) => this.positionService.getPositionById(params.id),
  });

  position = computed<Position | null>(() => this.positionResource.value() ?? null);

  redirectEffect = effect(() => {
    if (this.positionResource.error()) {
      this.router.navigateByUrl('/admin/positions');
    }
  });

  onOpenEditModal() {
    this.editPositionModal.show();
  }

  onUpdated() {
    this.positionResource.reload();
  }

  onDelete() {
    const position = this.position();
    if (!position || this.isDeleting()) {
      return;
    }

    const shouldDelete = window.confirm('Esta accion eliminara el puesto. Deseas continuar?');
    if (!shouldDelete) {
      return;
    }

    this.isDeleting.set(true);

    this.positionService.deletePosition(position.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.router.navigateByUrl('/admin/positions');
      },
      error: () => this.isDeleting.set(false),
    });
  }
}
