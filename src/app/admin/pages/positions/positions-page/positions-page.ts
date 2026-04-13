import { PositionCreateModal } from '@admin/components/position-create-modal/position-create-modal';
import { Position } from '@admin/interfaces/positions/position.interface';
import { PositionService } from '@admin/services/position.service';
import { Component, ViewChild, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminVacantsCard } from '@admin/components/admin-vacants-card/admin-vacants-card';
import { Card } from '@vacants/interfaces/card.interface';

@Component({
  selector: 'app-positions-page',
  imports: [PositionCreateModal, AdminVacantsCard],
  templateUrl: './positions-page.html',
})
export class PositionsPage {
  private positionService = inject(PositionService);

  @ViewChild('createPositionModal') createPositionModal!: PositionCreateModal;

  positionsResource = rxResource({
    stream: () => this.positionService.getAllPositions(),
  });

  positionsList = computed<Position[]>(() => this.positionsResource.value() ?? []);

  positionCards = computed<Card[]>(() => this.positionsList().map((position) => ({
    Id: `${position.id}`,
    Title: position.name,
    State: position.departmentName,
    Description: `Salario: ${position.salary}`,
    Tecnologies: [`Depto #${position.departmentId}`],
  })));

  onOpenCreateModal() {
    this.createPositionModal.show();
  }

  onCreated() {
    this.positionsResource.reload();
  }
}
