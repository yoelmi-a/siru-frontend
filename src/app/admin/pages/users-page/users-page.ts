import { UserService } from '@admin/services/user.service';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { Pagination } from "@shared/components/pagination/pagination";
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, NgClass } from '@angular/common';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { RouterLink } from '@angular/router';
import { ChangeStatusModal } from '@shared/components/change-status-modal/change-status-modal';
import { User } from '@admin/interfaces/user.interface';
import { AccountService } from '@admin/services/account.service';
import { DesktopError } from "@shared/components/desktop-error/desktop-error";
import { MobileError } from "@shared/components/mobile-error/mobile-error";
import { RolePipe } from '@pipes/role.pipe';
import { DominicanPhonePipe } from '@pipes/dominicanPhone.pipe';
@Component({
  selector: 'app-users-page',
  imports: [Pagination, NgClass, DatePipe, RolePipe, RouterLink, DesktopError, MobileError, ChangeStatusModal, DominicanPhonePipe],
  templateUrl: './users-page.html',
})
export class UsersPage {

  userService = inject(UserService);
  accountService = inject(AccountService);
  paginationService = inject(PaginationService);
  selectedUser = signal<User | null>(null);
  @ViewChild('changeStatusModal') changeStatusModal!: ChangeStatusModal;
  @ViewChild('errorModal') mobileErrorModal!: MobileError;

  hasError = signal(false);
  errorMessage = this.accountService.errorMessage;

  usersResource = rxResource({
    params: () => ({page: this.paginationService.currentPage()}),
    stream: ({ params }) => {
      return this.userService.getAllUsers(params.page, 10)
    }
  });

  constructor() {
    effect(() => {
      if (this.hasError()) {
        this.openErrorModal();
      }
    });
  }

  openErrorModal() {
    // El método nativo de los elementos <dialog> es showModal()
    if (window.innerWidth < 768 && this.mobileErrorModal) {
      this.mobileErrorModal.show();
      this.hasError.set(false);
    }
  }

  onChangeStatusClick(user: User) {
    this.selectedUser.set(user);
    this.changeStatusModal.show({
      title: this.selectedUser()?.isDeleted ? 'Activar Usuario' : 'Desactivar Usuario',
      message:`¿Estás seguro que deseas ${this.selectedUser()?.isDeleted ? 'activar' : 'desactivar'}
      la cuenta de ${this.selectedUser()?.name} ${this.selectedUser()?.lastName}`,
      isDeleted: this.selectedUser()?.isDeleted ?? false
    });
    console.log('Selected user for status change:', user);
  }

  onChangeStatusCancelled() {
    this.selectedUser.set(null);
    console.log('Status change cancelled');
  }

  onChangeStatusConfirmed() {
    console.log('Status change confirmed for user:', this.selectedUser());
    const user = this.selectedUser();
    if (!user) return;

    this.accountService.changeStatus(user.id).subscribe((isSuccess) => {
      if (isSuccess) {
        this.selectedUser.set(null);
        this.usersResource.reload();
        console.log('User status changed successfully');
        return;
      }

      this.selectedUser.set(null);
      console.error('Failed to change user status');
      this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 5000);
    });
  }
}
