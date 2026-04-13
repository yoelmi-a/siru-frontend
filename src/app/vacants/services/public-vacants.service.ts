import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../utils/constants';
import { Vacant } from '@vacants/interfaces/vacant.interface';

@Injectable({ providedIn: 'root' })
export class PublicVacantsService {
  private http = inject(HttpClient);

  getAllVacants(): Observable<Vacant[]> {
    return this.http.get<Vacant[]>(`${BASE_URL}/Vacants`);
  }

  getVacantById(id: string): Observable<Vacant> {
    return this.http.get<Vacant>(`${BASE_URL}/Vacants/${id}`);
  }
}
