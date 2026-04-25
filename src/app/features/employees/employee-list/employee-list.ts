import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { EmployeeListDto } from '@core/models/employee.models';
import { Pagination } from '@shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, Pagination, ConfirmDialogComponent],
  templateUrl: './employee-list.html'
})
export class EmployeeListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  employees = signal<EmployeeListDto[]>([]);
  loading = signal(false);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = 10;
  activeFilter = signal<boolean | null>(null); // null = All, true = Active, false = Inactive
  
  employeeToDelete = signal<EmployeeListDto | null>(null);

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() * this.pageSize < this.totalCount());

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(page: number = 1) {
    this.loading.set(true);
    this.api.getEmployees({
      page,
      pageSize: this.pageSize,
      isActive: this.activeFilter()
    }).subscribe({
      next: (response) => {
        this.employees.set(response.items);
        this.totalCount.set(response.pagination.totalCount);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load employees');
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: boolean | null) {
    this.activeFilter.set(filter);
    this.loadEmployees(1);
  }

  confirmDeactivate(employee: EmployeeListDto) {
    this.employeeToDelete.set(employee);
  }

  onDeactivate() {
    const employee = this.employeeToDelete();
    if (!employee) return;

    this.api.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.toast.success('Employee deactivated successfully');
        this.employeeToDelete.set(null);
        this.loadEmployees(this.currentPage());
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to deactivate employee');
        this.employeeToDelete.set(null);
      }
    });
  }
}
