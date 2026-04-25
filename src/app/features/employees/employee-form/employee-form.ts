import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { EmployeeInsertDto, EmployeeUpdateDto } from '@core/models/employee.models';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './employee-form.html'
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  employeeId = signal<string | null>(null);
  loading = signal(false);
  isSubmitting = signal(false);

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    cedula: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId.set(id);
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string) {
    this.loading.set(true);
    this.api.getEmployee(id).subscribe({
      next: (emp) => {
        // Format date to YYYY-MM-DD for input type="date"
        const dob = emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '';
        
        this.form.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          address: emp.address,
          cedula: emp.cedula,
          phoneNumber: emp.phoneNumber,
          dateOfBirth: dob,
          email: emp.email
        });
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load employee data');
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const id = this.employeeId();
    const values = this.form.value;
    
    const dto: EmployeeInsertDto = {
      firstName: values.firstName!,
      lastName: values.lastName!,
      address: values.address!,
      cedula: values.cedula!,
      phoneNumber: values.phoneNumber!,
      dateOfBirth: new Date(values.dateOfBirth!).toISOString(),
      email: values.email! 
    };

    if (id) {
      this.api.updateEmployee(id, dto as EmployeeUpdateDto).subscribe({
        next: () => {
          this.toast.success('Employee updated successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to update employee');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.api.createEmployee(dto).subscribe({
        next: () => {
          this.toast.success('Employee registered successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.toast.error(err.error?.detail || 'Failed to register employee');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
