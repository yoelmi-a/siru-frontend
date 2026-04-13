import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../utils/constants';
import { CreatePostulation } from '@vacants/interfaces/create-postulation.interface';
import { Postulation } from '@vacants/interfaces/postulation.interface';

@Injectable({ providedIn: 'root' })
export class PostulationService {
  private http = inject(HttpClient);

  createPostulation(payload: CreatePostulation): Observable<Postulation> {
    return this.http.post<Postulation>(`${BASE_URL}/Postulations`, payload);
  }

  getPostulationsByCandidate(candidateId: string): Observable<Postulation[]> {
    return this.http.get<Postulation[]>(`${BASE_URL}/Postulations`, {
      params: {
        candidateId,
      },
    });
  }
}
