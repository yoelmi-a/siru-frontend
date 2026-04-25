import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService, CandidateStatus } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacancyApplicationResultDto } from '@core/models/vacancy.models';
import { environment } from '../../../../environments/environment';
 
@Component({
  selector: 'app-vacancy-applications-modal', 
  imports: [DecimalPipe],
  templateUrl: './vacancy-applications-modal.html'  
})
export class VacancyApplicationsModalComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  vacancyId = input.required<string>();
  vacancyTitle = input.required<string>();
  closed = output<void>();

  applications = signal<VacancyApplicationResultDto[]>([]);
  loading = signal(false);
  isRecalculating = signal(false);
  isUpdatingStatus = signal<string | null>(null);
  currentPage = signal(1);
  totalCount = signal(0);
  readonly pageSize = 10;

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() * this.pageSize < this.totalCount());

  ngOnInit() {
    this.loadApplications(1);
  }

  loadApplications(page: number) {
    this.loading.set(true);
    this.api.getVacancyApplications(this.vacancyId(), { page, pageSize: this.pageSize }).subscribe({
      next: (response) => {
        this.applications.set(response.items);
        this.totalCount.set(response.pagination.totalCount);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load applications');
        this.loading.set(false);
      }
    });
  }

  goToPreviousPage() {
    if (this.hasPreviousPage()) {
      this.loadApplications(this.currentPage() - 1);
    }
  }

  goToNextPage() {
    if (this.hasNextPage()) {
      this.loadApplications(this.currentPage() + 1);
    }
  }

  getScoreBadgeClass(score: number): string {
    if (score >= 0.7) return 'badge-success';
    if (score >= 0.4) return 'badge-warning';
    return 'badge-error';
  }

  recalculateScores() {
    this.isRecalculating.set(true);
    this.api.recalculateScores(this.vacancyId()).subscribe({
      next: () => {
        this.toast.success('Scores recalculated successfully');
        this.loadApplications(this.currentPage());
        this.isRecalculating.set(false);
      },
      error: () => {
        this.toast.error('Failed to recalculate scores');
        this.isRecalculating.set(false);
      }
    });
  }

  getFullCvUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = environment.apiUrl.replace(/\/api$/, '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  changeStatus(applicationId: string, newStatus: CandidateStatus) {
    this.isUpdatingStatus.set(applicationId);
    this.api.setApplicationStatus(applicationId, newStatus).subscribe({
      next: () => {
        this.toast.success(`Status updated to ${newStatus}`);
        this.loadApplications(this.currentPage());
        this.isUpdatingStatus.set(null);
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to update status');
        this.isUpdatingStatus.set(null);
      }
    });
  }

  onClose() {
    this.closed.emit();
  }
}
