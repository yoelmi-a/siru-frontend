import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { EmployeeDto, EmployeeHistoryDto, EvaluationHistoryDto } from '@core/models/employee.models';
import { AssignPositionModalComponent } from '../components/assign-position-modal/assign-position-modal';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, AssignPositionModalComponent],
  templateUrl: './employee-detail.html' 
})
export class EmployeeDetailComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  employee = signal<EmployeeDto | null>(null);
  history = signal<EmployeeHistoryDto[]>([]);
  evaluations = signal<EvaluationHistoryDto[]>([]);
  loading = signal(true);
  activeTab = signal<'history' | 'evaluations'>('history');
  showAssignModal = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAllData(id);
    }
  }

  loadAllData(id: string) {
    this.loading.set(true);
    forkJoin({
      employee: this.api.getEmployee(id),
      history: this.api.getEmployeeHistory(id),
      evaluations: this.api.getEmployeeEvaluations(id)
    }).subscribe({
      next: (res) => {
        this.employee.set(res.employee);
        this.history.set(res.history);
        this.evaluations.set(res.evaluations);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load employee details');
        this.loading.set(false);
      }
    });
  }

  reloadHistory() {
    const id = this.employee()?.id;
    if (id) {
      this.api.getEmployeeHistory(id).subscribe(data => this.history.set(data));
    }
    this.showAssignModal.set(false);
  }

  getScoreClass(score: number): string {
    if (score >= 4) return 'badge-success';
    if (score >= 2.5) return 'badge-warning';
    return 'badge-error';
  }
}
