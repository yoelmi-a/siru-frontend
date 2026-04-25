import { Component, signal } from '@angular/core';
import { PositionListComponent } from '../position-list/position-list';
import { DepartmentListComponent } from '../department-list/department-list';

@Component({
  selector: 'app-positions-page',
  imports: [PositionListComponent, DepartmentListComponent],
  templateUrl: './positions-page.html'
})
export class PositionsPage {
  activeTab = signal<'positions' | 'departments'>('positions');

  setTab(tab: 'positions' | 'departments') {
    this.activeTab.set(tab);
  }
}