import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { PositionDto } from '@core/models/position.models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';
import { PositionFormComponent } from '../position-form/position-form';

@Component({
  selector: 'app-position-list',
  imports: [CurrencyPipe, ConfirmDialogComponent, PositionFormComponent],
  templateUrl: './position-list.html'
})
export class PositionListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  positions = signal<PositionDto[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingPosition = signal<PositionDto | null>(null);
  confirmDelete = signal<PositionDto | null>(null);

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.loading.set(true);
    this.api.getPositions().subscribe({
      next: (data) => {
        this.positions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load positions');
        this.loading.set(false);
      }
    });
  }

  openCreateForm() {
    this.editingPosition.set(null);
    this.showForm.set(true);
  }

  openEditForm(position: PositionDto) {
    this.editingPosition.set(position);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingPosition.set(null);
  }

  onFormSaved() {
    this.closeForm();
    this.loadPositions();
  }

  confirmDeletePosition(position: PositionDto) {
    this.confirmDelete.set(position);
  }

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  deletePosition() {
    const position = this.confirmDelete();
    if (!position) return;

    this.api.deletePosition(position.id).subscribe({
      next: () => {
        this.toast.success('Position deleted successfully');
        this.confirmDelete.set(null);
        this.loadPositions();
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to delete position');
        this.confirmDelete.set(null);
      }
    });
  }
}