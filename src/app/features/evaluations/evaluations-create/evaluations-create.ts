import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CriterionDto, EvaluationInsertDto, EvaluationCriterionInsertDto } from '@core/models/evaluation.models';
import { EmployeeListDto } from '@core/models/employee.models';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';

@Component({
  selector: 'app-evaluations-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabel, RouterLink, DecimalPipe],
  templateUrl: './evaluations-create.html'
})
export class EvaluationsCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  employees = signal<EmployeeListDto[]>([]);
  criteriaOptions = signal<CriterionDto[]>([]);
  isSubmitting = signal(false);
  loading = signal(true);

  form = this.fb.group({
    employeeId: ['', [Validators.required]],
    evaluationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    criteria: this.fb.array([], Validators.required)
  });

  // Signal derived from form value changes to calculate average
  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  
  averageScore = computed(() => {
    const criteria = this.formValues().criteria as any[];
    if (!criteria || criteria.length === 0) return 0;
    
    let total = 0;
    let count = 0;
    for (const c of criteria) {
      if (c && typeof c.score === 'number' && !isNaN(c.score)) {
        total += c.score;
        count++;
      }
    }
    return count > 0 ? (total / count) : 0;
  });

  hasDuplicateCriteria = computed(() => {
    const criteria = this.formValues()?.criteria as any[];
    if (!criteria) return false;
    const ids = criteria
      .map(c => c?.criterionId)
      .filter(id => id != null && id !== '');
    return new Set(ids.map(id => String(id))).size !== ids.length;
  });

  get criteriaFormArray() {
    return this.form.get('criteria') as FormArray;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    // Load active employees and evaluation criteria concurrently
    let employeesLoaded = false;
    let criteriaLoaded = false;

    const checkDone = () => {
      if (employeesLoaded && criteriaLoaded) {
        this.loading.set(false);
        // Add one initial criterion row if criteria exist
        if (this.criteriaOptions().length > 0) {
          this.addCriterionRow();
        }
      }
    };

    this.api.getEmployees({ page: 1, pageSize: 1000, isActive: true }).subscribe({
      next: (res) => {
        this.employees.set(res.items);
        employeesLoaded = true;
        checkDone();
      },
      error: () => {
        this.toast.error('Failed to load employees');
        employeesLoaded = true;
        checkDone();
      }
    });

    this.api.getCriteria().subscribe({
      next: (data) => {
        this.criteriaOptions.set(data);
        criteriaLoaded = true;
        checkDone();
      },
      error: () => {
        this.toast.error('Failed to load evaluation criteria');
        criteriaLoaded = true;
        checkDone();
      }
    });
  }

  addCriterionRow() {
    const criterionGroup = this.fb.group({
      criterionId: ['', [Validators.required]],
      score: [null as number | null, [Validators.required, Validators.min(0), Validators.max(5)]],
      observation: ['']
    });
    this.criteriaFormArray.push(criterionGroup);
  }

  removeCriterionRow(index: number) {
    this.criteriaFormArray.removeAt(index);
  }

  isCriterionDisabled(id: number, index: number): boolean {
    const criteria = this.formValues()?.criteria as any[];
    if (!criteria) return false;
    return criteria.some((c, i) => i !== index && c?.criterionId != null && c?.criterionId != '' && String(c.criterionId) === String(id));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      if (this.criteriaFormArray.length === 0) {
        this.toast.error('At least one criterion is required');
      } else {
        this.toast.error('Please fix the validation errors in the form');
      }
      return;
    }

    this.isSubmitting.set(true);
    const values = this.form.value;

    // Check for duplicate criteria
    if (this.hasDuplicateCriteria()) {
      this.toast.error('You cannot select the same criterion more than once');
      this.isSubmitting.set(false);
      return;
    }

    const criteriaDtos: EvaluationCriterionInsertDto[] = (values.criteria || []).map((c: any) => ({
      criterionId: Number(c.criterionId),
      score: Number(c.score),
      observation: c.observation ? c.observation : undefined
    }));

    const dto: EvaluationInsertDto = {
      employeeId: values.employeeId!,
      evaluationDate: new Date(values.evaluationDate!).toISOString(),
      criteria: criteriaDtos
    };

    this.api.createEvaluation(dto).subscribe({
      next: () => {
        this.toast.success('Evaluation created successfully!');
        this.router.navigate(['/evaluations/history']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error('Employee not found');
        } else {
          this.toast.error(err.error?.detail || 'Failed to create evaluation');
        }
        this.isSubmitting.set(false);
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 4) return 'text-success';
    if (score >= 2.5) return 'text-warning';
    return 'text-error';
  }
}
