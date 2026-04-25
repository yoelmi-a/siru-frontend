import { Component } from '@angular/core';
import { VacancyManageListComponent } from '../vacancy-manage-list/vacancy-manage-list';

@Component({
  selector: 'app-vacancies-manage-page',
  imports: [VacancyManageListComponent],
  templateUrl: './vacancies-manage-page.html'
})
export class VacanciesManagePage {}
