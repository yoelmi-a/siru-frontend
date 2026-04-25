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
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    cedula: ['', Validators.required],
    email: ['', [Validators.pattern(FormUtils.emailPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.dominicanPhonePattern)]],
    dateOfBirth: [new Date().toISOString().split('T')[0], Validators.required]
  });

  openModal(employee?: Employee) {
    this.errorMessage.set(null);
    if (employee) {
      this.isEdit.set(true);
      this.currentEmployeeId.set(employee.id);
      this.form.patchValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        address: employee.address,
        cedula: employee.cedula,
        email: employee.email ?? '',
        phoneNumber: employee.phoneNumber,
        dateOfBirth: employee.dateOfBirth
      });
    } else {
      this.isEdit.set(false);
      this.currentEmployeeId.set(null);
      this.form.reset({ dateOfBirth: new Date().toISOString().split('T')[0] });
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
      firstName: formValues.firstName!,
      lastName: formValues.lastName!,
      address: formValues.address!,
      cedula: formValues.cedula!,
      email: formValues.email || undefined,
      phoneNumber: formValues.phoneNumber!,
      dateOfBirth: formValues.dateOfBirth!
    };

    const request$: Observable<void> = this.isEdit() && this.currentEmployeeId()
      ? this.service.updateEmployee(this.currentEmployeeId()!, payload).pipe(map(() => undefined))
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
