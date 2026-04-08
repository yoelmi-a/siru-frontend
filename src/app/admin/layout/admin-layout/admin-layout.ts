import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {

  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    console.log("Admin layout logging out");
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
