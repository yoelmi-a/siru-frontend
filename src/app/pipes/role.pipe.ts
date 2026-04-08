import { Pipe, PipeTransform } from '@angular/core';

export const ROLE_LABELS: Record<string, string> = {
  Owner: 'Dueño',
  Admin: 'Administrador',
  SuperAdmin: 'Programador',
  Delivery: 'Repartidor',
  Mechanic: 'Mecánico',
  Clerk: 'Oficinista'
} as const;

@Pipe({
  name: 'role'
})

export class RolePipe implements PipeTransform {
  transform(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }
}
