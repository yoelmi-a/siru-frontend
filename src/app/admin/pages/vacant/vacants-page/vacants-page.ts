import { VacantService } from '@admin/services/vacant.service';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { VacantCreateModal } from '@admin/components/vacant-create-modal/vacant-create-modal';
import { ViewChild } from '@angular/core';
import { AdminVacantsCard } from '@admin/components/admin-vacants-card/admin-vacants-card';
import { Card } from '@vacants/interfaces/card.interface';
import { VacantGet } from '@admin/interfaces/vacants/vacantget.interface';
import { PaginatedResponse } from '@shared/interfaces/paginated-response.interface';

@Component({
    selector: 'app-vacants-page',
    imports: [Pagination, VacantCreateModal, AdminVacantsCard],
    templateUrl: './vacants-page.html'
})
export class VacantsPage {
    private vacantService = inject(VacantService);
    paginationService = inject(PaginationService);
    @ViewChild('createVacantModal') createVacantModal!: VacantCreateModal;

    vacantsResource = rxResource({
        params: () => ({ page: this.paginationService.currentPage() }),
        stream: ({ params }) => this.vacantService.GetAllVacants(params.page, 10)
    });

    vacantsList = computed<VacantGet[]>(() => {
        const response = this.vacantsResource.value() as PaginatedResponse<VacantGet> | VacantGet[] | undefined;

        if (!response) {
            return [];
        }

        return Array.isArray(response) ? response : response.items;
    });

    paginationData = computed<PaginatedResponse<VacantGet> | null>(() => {
        const response = this.vacantsResource.value() as PaginatedResponse<VacantGet> | VacantGet[] | undefined;

        if (!response || Array.isArray(response)) {
            return null;
        }

        return response;
    });

    activeVacants = computed(() => this.vacantsList().filter((vacant) => vacant.status === 0).length);
    inactiveVacants = computed(() => this.vacantsList().filter((vacant) => vacant.status !== 0).length);

    vacantCards = computed<Card[]>(() => {
        const vacants = this.vacantsList();

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

    onOpenCreateModal() {
        this.createVacantModal.show();
    }

    onVacantCreated() {
        this.vacantsResource.reload();
    }
}