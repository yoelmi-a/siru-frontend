import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'change-status-modal',
  imports: [],
  templateUrl: './change-status-modal.html',
})
export class ChangeStatusModal {
  title = signal<string>('Desactivar registro');
  message = signal<string>('¿Está seguro que desea desactivar este registro?');
  isDeleted = signal<boolean>(false);

  confirmed = output<void>();
  cancelled = output<void>();

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  show(data: { title: string; message: string; isDeleted: boolean }) {
    this.title.set(data.title);
    this.message.set(data.message);
    this.isDeleted.set(data.isDeleted);
    this.dialog.nativeElement.showModal();
  }

  onConfirm() {
    this.dialog.nativeElement.close();
    this.confirmed.emit();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.cancelled.emit();
  }
}
