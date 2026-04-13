import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Candidate } from '@admin/interfaces/candidates/candidate.interface';
import { SaveCandidate } from '@admin/interfaces/candidates/save-candidate.interface';
import { BASE_URL } from '../../../utils/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private http = inject(HttpClient);

  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${BASE_URL}/Candidates`);
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${BASE_URL}/Candidates/${id}`);
  }

  createCandidate(candidate: SaveCandidate): Observable<Candidate> {
    return this.http.post<Candidate>(`${BASE_URL}/Candidates`, candidate);
  }

  updateCandidate(id: string, candidate: SaveCandidate): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/Candidates/${id}`, candidate);
  }

  deleteCandidate(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/Candidates/${id}`);
  }
}
