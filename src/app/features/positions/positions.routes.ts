import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const positionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./positions-page/positions-page').then(m => m.PositionsPage),
    canActivate: [adminGuard]
  }
];

export default positionsRoutes;