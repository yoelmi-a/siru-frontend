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
      }
    ]
  }
];

export default VacanciesRoutes;