import { Component } from '@angular/core';
import { CandidateListComponent } from '../candidate-list/candidate-list';

@Component({
  selector: 'app-candidates-page',
  imports: [CandidateListComponent],
  templateUrl: './candidates-page.html'
})
export class CandidatesPage {}
