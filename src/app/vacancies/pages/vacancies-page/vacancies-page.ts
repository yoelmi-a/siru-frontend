import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacantDto } from '@core/models/vacancy.models';

@Component({
  selector: 'app-vacancies-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './vacancies-page.html'
})
export class VacanciesPage implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  vacancies = signal<VacantDto[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.getVacancies().subscribe({
      next: (data) => {
        // Only show Open vacancies to the public
        const openVacancies = data.filter(v => v.status === 'Open');
        this.vacancies.set(openVacancies);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load vacancies');
        this.loading.set(false);
      }
    });
  }
}