import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { EmployeeListDto } from '@core/models/employee.models';
import { EvaluationHistoryDto } from '@core/models/employee.models';

@Component({
  selector: 'app-evaluations-history',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './evaluations-history.html'
})
export class EvaluationsHistoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  employees = signal<EmployeeListDto[]>([]);
  evaluations = signal<EvaluationHistoryDto[]>([]);
  
  loadingEmployees = signal(true);
  loadingEvaluations = signal(false);
  hasSearched = signal(false);

  form = this.fb.group({
    employeeId: ['']
  });

  ngOnInit() {
    this.loadEmployees();

    this.form.get('employeeId')?.valueChanges.subscribe(id => {
      if (id) {
        this.loadEvaluations(id);
      } else {
        this.evaluations.set([]);
        this.hasSearched.set(false);
      }
    });
  }

  loadEmployees() {
    this.loadingEmployees.set(true);
    // Load all active employees for the dropdown
    this.api.getEmployees({ page: 1, pageSize: 1000, isActive: true }).subscribe({
      next: (res) => {
        this.employees.set(res.items);
        this.loadingEmployees.set(false);
      },
      error: () => {
        this.toast.error('Failed to load employees');
        this.loadingEmployees.set(false);
      }
    });
  }

  loadEvaluations(employeeId: string) {
    this.loadingEvaluations.set(true);
    this.hasSearched.set(true);
    this.api.getEmployeeEvaluations(employeeId).subscribe({
      next: (data) => {
        this.evaluations.set(data);
        this.loadingEvaluations.set(false);
      },
      error: () => {
        this.toast.error('Failed to load evaluations for this employee');
        this.loadingEvaluations.set(false);
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 4) return 'badge-success';
    if (score >= 2.5) return 'badge-warning';
    return 'badge-error';
  }
}
