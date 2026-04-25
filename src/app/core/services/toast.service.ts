import { Injectable, inject } from '@angular/core';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class ToastService {
  success(message: string): void {
    if (typeof window !== 'undefined' && window.toastr) {
      window.toastr.success(message);
    }
  }

  error(message: string): void {
    if (typeof window !== 'undefined' && window.toastr) {
      window.toastr.error(message);
    }
  }

  warning(message: string): void {
    if (typeof window !== 'undefined' && window.toastr) {
      window.toastr.warning(message);
    }
  }

  info(message: string): void {
    if (typeof window !== 'undefined' && window.toastr) {
      window.toastr.info(message);
    }
  }
}