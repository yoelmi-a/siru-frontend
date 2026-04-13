import { DepartmentCreateModal } from '@admin/components/department-create-modal/department-create-modal';
import { Department } from '@admin/interfaces/departments/department.interface';
import { DepartmentService } from '@admin/services/department.service';
import { Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-department-details-page',
  imports: [RouterLink, DepartmentCreateModal],
  templateUrl: './department-details.page.html',
})
export class DepartmentDetailsPage {
  private departmentService = inject(DepartmentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('editDepartmentModal') editDepartmentModal!: DepartmentCreateModal;

  departmentId = toSignal<string>(this.activatedRoute.params.pipe(map((params) => params['id'])));
  isDeleting = signal(false);

  departmentResource = rxResource({
    params: () => ({ id: Number(this.departmentId() ?? 0) }),
    stream: ({ params }) => this.departmentService.getDepartmentById(params.id),
  });

  department = computed<Department | null>(() => this.departmentResource.value() ?? null);

  redirectEffect = effect(() => {
    if (this.departmentResource.error()) {
      this.router.navigateByUrl('/admin/departments');
    }
  });

  onOpenEditModal() {
    this.editDepartmentModal.show();
  }

  onUpdated() {
    this.departmentResource.reload();
  }

  onDelete() {
    const department = this.department();
    if (!department || this.isDeleting()) {
      return;
    }

    const shouldDelete = window.confirm('Esta accion eliminara el departamento. Deseas continuar?');
    if (!shouldDelete) {
      return;
    }

    this.isDeleting.set(true);

    this.departmentService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.router.navigateByUrl('/admin/departments');
      },
      error: () => this.isDeleting.set(false),
    });
  }
}
