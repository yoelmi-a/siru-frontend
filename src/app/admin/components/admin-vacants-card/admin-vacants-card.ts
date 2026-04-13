import { Component, input } from '@angular/core';
import { Card } from '@vacants/interfaces/card.interface';
import { VacantsCard } from '@vacants/components/vacants-card/vacants-card.component';

@Component({
  selector: 'app-admin-vacants-card',
  imports: [VacantsCard],
  templateUrl: './admin-vacants-card.html',
  host: {
    class: 'block w-full'
  }
})
export class AdminVacantsCard {
  positions = input.required<Card[]>();
  detailRoute = input<string>('/admin/vacants');
}
