import { Component, EventEmitter, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialogComponent {
  title = input('Confirm');
  message = input('Are you sure?');
  confirmText = input('Confirm');
  cancelText = input('Cancel');

  confirmed = output<void>();
  cancelled = output<void>();
}