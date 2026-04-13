import { DepartmentCreateModal } from '@admin/components/department-create-modal/department-create-modal';
import { Department } from '@admin/interfaces/departments/department.interface';
import { DepartmentService } from '@admin/services/department.service';
import { Component, ViewChild, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminVacantsCard } from '@admin/components/admin-vacants-card/admin-vacants-card';
import { Card } from '@vacants/interfaces/card.interface';

@Component({
  selector: 'app-departments-page',
  imports: [DepartmentCreateModal, AdminVacantsCard],
  templateUrl: './departments-page.html',
})
export class DepartmentsPage {
  private departmentService = inject(DepartmentService);

  @ViewChild('createDepartmentModal') createDepartmentModal!: DepartmentCreateModal;

  departmentsResource = rxResource({
    stream: () => this.departmentService.getAllDepartments(),
  });

  departmentsList = computed<Department[]>(() => this.departmentsResource.value() ?? []);

  departmentCards = computed<Card[]>(() => this.departmentsList().map((department) => ({
    Id: `${department.id}`,
    Title: department.name,
    State: 'Departamento',
    Description: `ID: ${department.id}`,
    Tecnologies: [],
  })));

  onOpenCreateModal() {
    this.createDepartmentModal.show();
  }

  onCreated() {
    this.departmentsResource.reload();
  }
}
