import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { UsersPage } from './pages/users-page/users-page';
import { UserPage } from './pages/user-page/user-page';

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
        path: 'users/:id',
        component: UserPage
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

export default adminRoutes;
