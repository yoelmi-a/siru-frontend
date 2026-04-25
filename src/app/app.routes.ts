import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { adminGuard } from '@core/guards/admin.guard';
import { MainLayout } from '@layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MySessionsComponent } from './features/auth/my-sessions.component';

export const routes: Routes = [
  {
    path: 'vacancies',
    loadChildren: () => import('./vacancies/vacancies.routes')
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: 'positions',
    loadChildren: () => import('./features/positions/positions.routes')
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'vacancies-manage',
        loadChildren: () => import('./features/vacancies/vacancies-manage.routes')
      },
      {
        path: 'candidates',
        loadChildren: () => import('./features/candidates/candidates.routes')
      },
      {
        path: 'auth/me/sessions',
        component: MySessionsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/vacancies'
  }
];