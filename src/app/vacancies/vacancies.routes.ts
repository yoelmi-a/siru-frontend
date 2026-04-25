import { Routes } from '@angular/router';
import { PublicLayout } from '@layouts/public-layout/public-layout';
import { VacanciesPage } from './pages/vacancies-page/vacancies-page';

export const VacanciesRoutes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [ 
      {
        path: '',
        component: VacanciesPage
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/vacancy-detail/vacancy-detail').then(m => m.VacancyDetailPage)
      },
      {
        path: ':id/apply',
        loadComponent: () => import('./pages/vacancy-apply/vacancy-apply').then(m => m.VacancyApplyPage)
      }
    ]
  }
];

export default VacanciesRoutes;