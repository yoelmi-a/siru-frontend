import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacantDto } from '@core/models/vacancy.models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';
import { VacancyFormComponent } from '../vacancy-form/vacancy-form';

@Component({
  selector: 'app-vacancy-manage-list',
  imports: [DatePipe, ConfirmDialogComponent, VacancyFormComponent],
  templateUrl: './vacancy-manage-list.html'
})
export class VacancyManageListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  vacancies = signal<VacantDto[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingVacancy = signal<VacantDto | null>(null);
  confirmDelete = signal<VacantDto | null>(null);
  activeFilter = signal<'All' | 'Open' | 'Closed' | 'Cancelled'>('All');

  filteredVacancies = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.vacancies();
    }
    return this.vacancies().filter(v => v.status === filter);
  });

  ngOnInit() {
    this.loadVacancies();
  }

  loadVacancies() {
    this.loading.set(true);
    this.api.getVacancies().subscribe({
      next: (data) => {
        this.vacancies.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load vacancies');
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'All' | 'Open' | 'Closed' | 'Cancelled') {
    this.activeFilter.set(filter);
  }

  openCreateForm() {
    this.editingVacancy.set(null);
    this.showForm.set(true);
  }

  openEditForm(vacancy: VacantDto) {
    this.editingVacancy.set(vacancy);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingVacancy.set(null);
  }

  onFormSaved() {
    this.closeForm();
    this.loadVacancies();
  }

  confirmDeleteVacancy(vacancy: VacantDto) {
    this.confirmDelete.set(vacancy);
  }

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  deleteVacancy() {
    const vacancy = this.confirmDelete();
    if (!vacancy) return;

    this.api.deleteVacancy(vacancy.id).subscribe({
      next: () => {
        this.toast.success('Vacancy deleted successfully');
        this.confirmDelete.set(null);
        this.loadVacancies();
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to delete vacancy');
        this.confirmDelete.set(null);
      }
    });
  }
}
