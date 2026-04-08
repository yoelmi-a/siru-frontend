import { afterNextRender, Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[phoneMask]' })
export class PhoneMaskDirective {
  element = inject(ElementRef);
  formControl = inject(NgControl, { optional: false });

  constructor() {
    afterNextRender(() => {
      const value = this.formControl.control?.value;
      if (value) {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        this.element.nativeElement.value = this.formatDisplay(digits);
      }
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Guarda la posición del cursor antes de formatear
    const cursorPosition = input.selectionStart ?? 0;

    // Dígitos antes del cursor
    const rawBefore = input.value.slice(0, cursorPosition).replace(/\D/g, '').length;

    // 1. Extrae solo los dígitos de lo que el usuario escribió
    const digits = input.value.replace(/\D/g, '').slice(0, 10);

    // 2. Actualiza el FormControl sin propagar el cambio al DOM
    this.formControl?.control?.setValue(digits, {
      emitEvent: true,              // sí emite valueChanges para validadores
      emitModelToViewChange: false, // ← no sobreescribe lo que el usuario ve
    });

    // 3. Actualiza la vista con el formato visual
    input.value = this.formatDisplay(digits);

    // Calcula la nueva posición del cursor en el string formateado
    const newCursor = this.getCursorPosition(input.value, rawBefore);

    // Restaura el cursor — requestAnimationFrame asegura que el DOM ya se actualizó
    requestAnimationFrame(() => {
      input.setSelectionRange(newCursor, newCursor);
    });
  }

  private formatDisplay(digits: string): string {
    if (!digits) return '';

    // Construye el formato progresivamente según cuántos dígitos hay
    // 809 - 123 - 4567
    if (digits.length <= 3)
      return `(${digits}`;

    if (digits.length <= 6)
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  private getCursorPosition(formatted: string, rawIndex: number): number {
    let count = 0;

    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) count++;
      if (count === rawIndex) return i + 1;
    }

    return formatted.length;
  }
}


