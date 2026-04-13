import { VacantService } from '@admin/services/vacant.service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { map } from 'rxjs';
import { VacantCreateModal } from '@admin/components/vacant-create-modal/vacant-create-modal';
import { ViewChild } from '@angular/core';
import { VacantGet } from '@admin/interfaces/vacants/vacantget.interface';
import { PaginatedResponse } from '@shared/interfaces/paginated-response.interface';
import { CvAnalysisService, CandidateRanking } from '@admin/services/cv-analysis.service';

@Component({
    selector: 'app-vacant-details-page',
    imports: [RouterLink, DatePipe, NgClass, VacantCreateModal],
    templateUrl: './vacant-details.page.html'
})
export class VacantDetailsComponent {
    private vacantService = inject(VacantService);
    private cvAnalysisService = inject(CvAnalysisService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    ranking = signal<CandidateRanking[]>([]);
    isRankingLoading = signal(false);

    vacantId = toSignal<string>(
        this.activatedRoute.params.pipe(map((params) => params['id']))
    );

    isEditMode = computed(() => this.vacantId() !== 'new');

    vacantResource = rxResource({
        params: () => ({ id: this.vacantId() }),
        stream: ({ params }) => this.vacantService.GetVacantsById(params.id ?? 'new', 1, 1)
    });

    private extractVacant(data: PaginatedResponse<VacantGet> | VacantGet | undefined): VacantGet | null {
        if (!data) {
            return null;
        }

        if ('items' in data) {
            return data.items.at(0) ?? null;
        }

        return data;
    }

    vacant = computed(() => this.extractVacant(this.vacantResource.value()));
    @ViewChild('editVacantModal') editVacantModal!: VacantCreateModal;
    isDeleting = signal(false);

    redirectEffect = effect(() => {
        if (this.vacantResource.error()) {
            this.router.navigateByUrl('/admin/vacants');
            return;
        }

        if (this.vacantResource.hasValue() && !this.vacant()) {
            this.router.navigateByUrl('/admin/vacants');
        }
    });

    onOpenEditModal() {
        this.editVacantModal.show();
    }

    onVacantUpdated() {
        this.vacantResource.reload();
    }

    loadRanking() {
        this.isRankingLoading.set(true);
        this.cvAnalysisService.getRankingForVacant(this.vacantId() || '').subscribe(res => {
            this.ranking.set(res);
            this.isRankingLoading.set(false);
        });
    }

    onDeleteVacant() {
        const vacant = this.vacant();
        if (!vacant || this.isDeleting()) {
            return;
        }

        const shouldDelete = window.confirm('Esta accion eliminara la vacante. Deseas continuar?');
        if (!shouldDelete) {
            return;
        }

        this.isDeleting.set(true);

        this.vacantService.DeleteVacant(vacant.id).subscribe({
            next: () => {
                this.isDeleting.set(false);
                this.router.navigateByUrl('/admin/vacants');
            },
            error: () => {
                this.isDeleting.set(false);
            }
        });
    }

}