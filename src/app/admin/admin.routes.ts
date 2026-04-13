import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { UsersPage } from './pages/users-page/users-page';
import { UserPage } from './pages/user-page/user-page';
import { VacantsPage } from './pages/vacant/vacants-page/vacants-page';
import { VacantDetailsComponent } from './pages/vacant/vacant-details-page/vacant-details.page';
import { CandidatesPage } from './pages/candidates/candidates-page/candidates-page';
import { CandidateDetailsPage } from './pages/candidates/candidate-details-page/candidate-details.page';
import { DepartmentsPage } from './pages/departments/departments-page/departments-page';
import { DepartmentDetailsPage } from './pages/departments/department-details-page/department-details.page';
import { PositionsPage } from './pages/positions/positions-page/positions-page';
import { PositionDetailsPage } from './pages/positions/position-details-page/position-details.page';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'home',
        component: AdminHomePage
      },
      {
        path: 'users',
        component: UsersPage
      },
      {
        path:   'users/:id',
        component: UserPage
      },
      {
        path: 'vacants',
        component: VacantsPage
      },
      {
        path: 'vacants/:id',
        component: VacantDetailsComponent
      },
      {
        path: 'candidates',
        component: CandidatesPage
      },
      {
        path: 'candidates/:id',
        component: CandidateDetailsPage
      },
      {
        path: 'departments',
        component: DepartmentsPage
      },
      {
        path: 'departments/:id',
        component: DepartmentDetailsPage
      },
      {
        path: 'positions',
        component: PositionsPage
      },
      {
        path: 'positions/:id',
        component: PositionDetailsPage
      },
      {
        path: 'employees',
        loadComponent: () => import('./pages/employees/employees-page/employees-page').then(m => m.EmployeesPage)
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./pages/employees/employee-details-page/employee-details-page').then(m => m.EmployeeDetailsPage)
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

export default adminRoutes;
