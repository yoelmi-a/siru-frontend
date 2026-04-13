import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'vacants',
    loadChildren: () => import('./vacants/vacants.routes'),
    // canMatch: [
    //   NotAuthenticatedGuard
    // ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // canMatch: [
    //   NotAuthenticatedGuard
    // ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    // canMatch: [
    //   IsAdminGuard
    // ]
  },
  {
    path: '**',
    redirectTo: 'vacants'
  }
];
