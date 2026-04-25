import { Routes } from '@angular/router';

export const employeesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-list/employee-list').then(m => m.EmployeeListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./employee-form/employee-form').then(m => m.EmployeeFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./employee-detail/employee-detail').then(m => m.EmployeeDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./employee-form/employee-form').then(m => m.EmployeeFormComponent)
  }
];

export default employeesRoutes;
