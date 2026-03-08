import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'vacants',
    loadChildren: () => import('./vacants/vacants.routes')
  },
  {
    path: '**',
    redirectTo: 'vacants'
  }
];
