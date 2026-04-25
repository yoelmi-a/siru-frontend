import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html'
})
export class MainLayout {
  authService = inject(AuthService);
  router = inject(Router);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get fullName(): string {
    return this.currentUser?.fullName ?? 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}