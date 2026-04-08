import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
    console.log('NotAuthenticatedGuard - isAuthenticated:', authService.isAuthenticated());
  console.log('NotAuthenticatedGuard - isAdmin:', authService.hasAdminPermission());

  if (!authService.isAuthenticated()) return true;

  if (authService.hasClerkPermission()) return router.parseUrl('/clerk/home');
  if (authService.hasDeliveryPermission()) return router.parseUrl('/delivery/home');

  return router.parseUrl('/admin/home');
}
