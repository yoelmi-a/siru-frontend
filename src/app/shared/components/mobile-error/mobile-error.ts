import { Component, ElementRef, input, ViewChild } from '@angular/core';

@Component({
  selector: 'mobile-error',
  imports: [],
  templateUrl: './mobile-error.html',
})
export class MobileError {
  errors = input.required<string>();
  @ViewChild('internalModal') dialog!: ElementRef<HTMLDialogElement>;

  show() {
    this.dialog.nativeElement.showModal();
  }
}
