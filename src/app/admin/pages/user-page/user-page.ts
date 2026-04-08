import { UserService } from '@admin/services/user.service';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserForm } from "@admin/components/user-form/user-form";

@Component({
  selector: 'app-user-page',
  imports: [UserForm],
  templateUrl: './user-page.html',
})
export class UserPage {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  userService = inject(UserService);
  isEditMode = computed(() => this.userId() !== 'new');

  userId = toSignal<string>(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  userResource = rxResource({
    params: () => ({ id: this.userId()}),
    stream: ({ params }) => {
      return this.userService.getAccountById(params.id ?? 'new');
    }
  });

  redirectEffect = effect(() => {
    if (this.userResource.error()) {
      this.router.navigateByUrl('/admin/users');
    }
  })
}
