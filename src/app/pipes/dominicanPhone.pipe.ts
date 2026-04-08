import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dominicanPhone'
})

export class DominicanPhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'No registrado';

    // Limpia todo lo que no sea dígito
    const digits = value.replace(/\D/g, '');

    if (digits.length !== 10) return value;

    const area    = digits.slice(0, 3);  // 809
    const part1   = digits.slice(3, 6);  // 123
    const part2   = digits.slice(6);     // 4567

    return `(${area}) ${part1}-${part2}`;  // (809) 123-4567
  }
}
