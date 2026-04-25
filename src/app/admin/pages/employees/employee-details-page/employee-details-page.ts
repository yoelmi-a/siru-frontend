import { Component, computed, inject, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmployeeCreateModalComponent } from '../../../components/employee-create-modal/employee-create-modal';
import { EvaluationService, EvaluationHistoryDto } from '../../../services/evaluation.service';
import { DatePipe } from '@angular/common';
import { Employee, EmployeeHistory } from '../../../interfaces/employees/employee.interface';

@Component({
  selector: 'app-employee-details-page',
  imports: [EmployeeCreateModalComponent, DatePipe],
  templateUrl: './employee-details-page.html',
})
export class EmployeeDetailsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(EmployeeService);
  private evaluationService = inject(EvaluationService);

  @ViewChild(EmployeeCreateModalComponent) modal!: EmployeeCreateModalComponent;

  evaluations = signal<EvaluationHistoryDto[]>([]);
  isEvaluationsLoading = signal(false);

  history = signal<EmployeeHistory[]>([]);
  isHistoryLoading = signal(false);

  employeeId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  employeeResource = rxResource({
    params: () => ({ id: this.employeeId() }),
    stream: ({ params }) => this.service.getEmployeeById(params.id)
  });

  employee = computed<Employee | undefined>(() => this.employeeResource.value() as Employee | undefined);

  goBack() {
    this.router.navigate(['/admin/employees']);
  }

  onEdit() {
    const emp = this.employee();
    if (emp) this.modal.openModal(emp);
  }

  onDelete() {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      this.service.deleteEmployee(this.employeeId()).subscribe(() => {
        this.goBack();
      });
    }
  }

  onSaved() {
    this.employeeResource.reload();
  }

  loadHistory() {
    this.isHistoryLoading.set(true);
    this.service.getEmployeeHistory(this.employeeId()).subscribe({
      next: (res) => {
        this.history.set(res);
        this.isHistoryLoading.set(false);
      },
      error: () => {
        this.isHistoryLoading.set(false);
      }
    });
  }

  loadEvaluations() {
    this.isEvaluationsLoading.set(true);
    this.evaluationService.getEvaluationsByEmployee(this.employeeId()).subscribe(res => {
      this.evaluations.set(res);
      this.isEvaluationsLoading.set(false);
    });
  }
}
