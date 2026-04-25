import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const candidatesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./candidates-page/candidates-page').then(m => m.CandidatesPage),
    canMatch: [adminGuard]
  }
];

export default candidatesRoutes;
