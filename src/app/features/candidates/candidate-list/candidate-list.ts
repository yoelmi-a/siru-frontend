import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CandidateDto } from '@core/models/candidate.models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';
import { Pagination } from '@shared/components/pagination/pagination';

@Component({
  selector: 'app-candidate-list',
  imports: [ConfirmDialogComponent, Pagination],
  templateUrl: './candidate-list.html'
})
export class CandidateListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly pageSize = 10;

  candidates = signal<CandidateDto[]>([]);
  loading = signal(false);
  confirmDelete = signal<CandidateDto | null>(null);

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map(params => +(params.get('page') ?? 1)),
      map(page => (isNaN(page) || page < 1 ? 1 : page))
    ),
    { initialValue: 1 }
  );

  totalCount = computed(() => this.candidates().length);
  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() * this.pageSize < this.totalCount());

  paginatedCandidates = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.candidates().slice(start, start + this.pageSize);
  });

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading.set(true);
    this.api.getCandidates().subscribe({
      next: (data) => {
        this.candidates.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load candidates');
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  confirmDeleteCandidate(candidate: CandidateDto) {
    this.confirmDelete.set(candidate);
  }

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  deleteCandidate() {
    const candidate = this.confirmDelete();
    if (!candidate) return;

    this.api.deleteCandidate(candidate.id).subscribe({
      next: () => {
        this.toast.success('Candidate deleted successfully');
        this.confirmDelete.set(null);
        this.loadCandidates();
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to delete candidate');
        this.confirmDelete.set(null);
      }
    });
  }
}
