import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { DepartmentDto } from '@core/models/department.models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';
import { DepartmentFormComponent } from '../department-form/department-form';

@Component({
  selector: 'app-department-list',
  imports: [ConfirmDialogComponent, DepartmentFormComponent],
  templateUrl: './department-list.html'
})
export class DepartmentListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  departments = signal<DepartmentDto[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingDepartment = signal<DepartmentDto | null>(null);
  confirmDelete = signal<DepartmentDto | null>(null);

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading.set(true);
    this.api.getDepartments().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load departments');
        this.loading.set(false);
      }
    });
  }

  openCreateForm() {
    this.editingDepartment.set(null);
    this.showForm.set(true);
  }

  openEditForm(department: DepartmentDto) {
    this.editingDepartment.set(department);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingDepartment.set(null);
  }

  onFormSaved() {
    this.closeForm();
    this.loadDepartments();
  }

  confirmDeleteDepartment(department: DepartmentDto) {
    this.confirmDelete.set(department);
  }

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  deleteDepartment() {
    const department = this.confirmDelete();
    if (!department) return;

    this.api.deleteDepartment(department.id).subscribe({
      next: () => {
        this.toast.success('Department deleted successfully');
        this.confirmDelete.set(null);
        this.loadDepartments();
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to delete department');
        this.confirmDelete.set(null);
      }
    });
  }
}