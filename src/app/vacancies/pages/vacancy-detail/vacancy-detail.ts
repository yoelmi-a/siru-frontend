import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { VacantDto } from '@core/models/vacancy.models';

@Component({
  selector: 'app-vacancy-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './vacancy-detail.html'
})
export class VacancyDetailPage implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vacancy = signal<VacantDto | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVacancy(id);
    } else {
      this.router.navigate(['/vacancies']);
    }
  }

  loadVacancy(id: string) {
    this.api.getVacancy(id).subscribe({
      next: (data) => {
        this.vacancy.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error('Vacancy not found');
        } else {
          this.toast.error('Failed to load vacancy details');
        }
        this.router.navigate(['/vacancies']);
      }
    });
  }
}
