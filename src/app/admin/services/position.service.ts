import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Position } from '@admin/interfaces/positions/position.interface';
import { SavePosition } from '@admin/interfaces/positions/save-position.interface';
import { BASE_URL } from '../../../utils/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private http = inject(HttpClient);

  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${BASE_URL}/Positions`);
  }

  getPositionById(id: number): Observable<Position> {
    return this.http.get<Position>(`${BASE_URL}/Positions/${id}`);
  }

  createPosition(position: SavePosition): Observable<Position> {
    return this.http.post<Position>(`${BASE_URL}/Positions`, position);
  }

  updatePosition(id: number, position: SavePosition): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/Positions/${id}`, position);
  }

  deletePosition(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/Positions/${id}`);
  }
}
