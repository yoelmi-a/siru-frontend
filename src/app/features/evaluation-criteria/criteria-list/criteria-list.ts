import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CriterionDto } from '@core/models/evaluation.models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';
import { CriterionFormModalComponent } from '../criterion-form-modal/criterion-form-modal';

@Component({
  selector: 'app-criteria-list',
  standalone: true,
  imports: [ConfirmDialogComponent, CriterionFormModalComponent],
  templateUrl: './criteria-list.html' 
})
export class CriteriaListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  criteria = signal<CriterionDto[]>([]);
  loading = signal(false);
  
  showForm = signal(false);
  editingCriterion = signal<CriterionDto | null>(null);
  confirmDelete = signal<CriterionDto | null>(null);

  ngOnInit() {
    this.loadCriteria();
  }

  loadCriteria() {
    this.loading.set(true);
    this.api.getCriteria().subscribe({
      next: (data) => {
        this.criteria.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load evaluation criteria');
        this.loading.set(false);
      }
    });
  }

  openCreateForm() {
    this.editingCriterion.set(null);
    this.showForm.set(true);
  }

  openEditForm(criterion: CriterionDto) {
    this.editingCriterion.set(criterion);
    this.showForm.set(true);
  }

  onFormSaved() {
    this.showForm.set(false);
    this.loadCriteria();
  }

  onDeleteConfirm() {
    const criterion = this.confirmDelete();
    if (!criterion) return;

    this.api.deleteCriterion(criterion.id).subscribe({
      next: () => {
        this.toast.success('Criterion deleted successfully');
        this.confirmDelete.set(null);
        this.loadCriteria();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toast.error('Cannot delete criterion because it is already used in evaluations');
        } else {
          this.toast.error(err.error?.detail || 'Failed to delete criterion');
        }
        this.confirmDelete.set(null);
      }
    });
  }
}
