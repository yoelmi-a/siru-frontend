import { Routes } from '@angular/router';

export const evaluationsRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () => import('./evaluations-create/evaluations-create').then(m => m.EvaluationsCreateComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./evaluations-history/evaluations-history').then(m => m.EvaluationsHistoryComponent)
  },
  {
    path: '',
    redirectTo: 'history',
    pathMatch: 'full'
  }
];

export default evaluationsRoutes;
