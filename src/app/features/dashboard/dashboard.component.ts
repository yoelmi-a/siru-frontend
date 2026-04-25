import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { VacantDto } from '@core/models/vacancy.models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService); 

  loading = signal(true);
  openVacanciesCount = signal(0);
  activeEmployeesCount = signal(0);
  avgHiringTime = signal(0);
  topOpenVacancies = signal<VacantDto[]>([]);

  ngOnInit() {
    forkJoin({
      vacancies: this.api.getVacancies(),
      employees: this.api.getEmployees({ isActive: true, page: 1, pageSize: 1 }),
      hiringTime: this.api.getHiringTimeReport()
    }).subscribe({
      next: (res) => {
        // Vacancies Logic
        const openVacancies = res.vacancies.filter(v => v.status === 'Open');
        this.openVacanciesCount.set(openVacancies.length);
        this.topOpenVacancies.set(openVacancies.slice(0, 5));

        // Employees Logic
        this.activeEmployeesCount.set(res.employees.pagination.totalCount);

        // Hiring Time Logic
        this.avgHiringTime.set(res.hiringTime.averageDays);

        this.loading.set(false);
      },
      error: () => {
        // Even on error, we should probably stop loading to avoid an infinite spinner
        this.loading.set(false);
      }
    });
  }
} 