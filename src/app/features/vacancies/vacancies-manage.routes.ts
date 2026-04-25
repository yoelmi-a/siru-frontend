import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const vacanciesManageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./vacancies-manage-page/vacancies-manage-page').then(m => m.VacanciesManagePage),
    canActivate: [adminGuard]
  }
];
 
export default vacanciesManageRoutes;
