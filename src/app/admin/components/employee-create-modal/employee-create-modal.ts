import { Component, ElementRef, inject, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../interfaces/employees/employee.interface';
import { Observable, map } from 'rxjs';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-employee-create-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-create-modal.html',
})
export class EmployeeCreateModalComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  
  saved = output<void>();

  isEdit = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  currentEmployeeId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.dominicanPhonePattern)]],
    departmentId: [''],
    positionId: [''],
    hireDate: [new Date().toISOString().split('T')[0]]
  });

  openModal(employee?: Employee) {
    this.errorMessage.set(null);
    if (employee) {
      this.isEdit.set(true);
      this.currentEmployeeId.set(employee.id);
      this.form.patchValue({
        name: employee.name,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        departmentId: employee.departmentId ?? '',
        positionId: employee.positionId ?? '',
        hireDate: employee.hireDate
      });
    } else {
      this.isEdit.set(false);
      this.currentEmployeeId.set(null);
      this.form.reset({ hireDate: new Date().toISOString().split('T')[0] });
    }
    
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValues = this.form.value;
    const payload = {
      name: formValues.name!,
      lastName: formValues.lastName!,
      email: formValues.email!,
      phoneNumber: formValues.phoneNumber!,
      departmentId: formValues.departmentId ?? '',
      positionId: formValues.positionId ?? '',
      hireDate: formValues.hireDate!
    };

    const request$: Observable<void> = this.isEdit() && this.currentEmployeeId()
      ? this.service.updateEmployee(this.currentEmployeeId()!, payload)
      : this.service.createEmployee(payload).pipe(map(() => undefined));

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.saved.emit();
        this.closeModal();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Error guardando datos');
      }
    });
  }
}
