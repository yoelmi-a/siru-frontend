import { Component, computed, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmployeeCreateModalComponent } from '../../../components/employee-create-modal/employee-create-modal';

@Component({
  selector: 'app-employees-page',
  imports: [EmployeeCreateModalComponent],
  templateUrl: './employees-page.html',
})
export class EmployeesPage {
  private service = inject(EmployeeService);
  private router = inject(Router);

  @ViewChild(EmployeeCreateModalComponent) modal!: EmployeeCreateModalComponent;

  employeesResource = rxResource({
    stream: () => this.service.getAllEmployees()
  });

  employees = computed(() => this.employeesResource.value() ?? []);

  onCreateClicked() {
    this.modal.openModal();
  }

  onEmployeeSelected(id: string) {
    this.router.navigate(['/admin/employees', id]);
  }

  onSaved() {
    this.employeesResource.reload();
  }
}
