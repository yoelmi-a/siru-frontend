import { Routes } from '@angular/router';

export const evaluationCriteriaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./criteria-list/criteria-list').then(m => m.CriteriaListComponent)
  }
];

export default evaluationCriteriaRoutes;
