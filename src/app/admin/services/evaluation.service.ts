import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../utils/constants';

export interface CriterionDto {
  id: number;
  name: string;
}

export interface EvaluationCriterionPayload {
  criterionId: number;
  score: number;
  observation?: string;
}

export interface EvaluationInsertPayload {
  employeeId: string;
  evaluationDate: string;
  criteria: EvaluationCriterionPayload[];
}

export interface EvaluationDetailDto {
  criterionId: number;
  criterionName: string;
  score: number;
  observation?: string;
}

export interface EvaluationDto {
  id: string;
  employeeId: string;
  employeeFullName: string;
  positionName: string;
  date: string;
  averageScore: number;
  criteria: EvaluationDetailDto[];
}

export interface EvaluationHistoryCriterionDto {
  name: string;
  score: number;
  observation?: string;
}

export interface EvaluationHistoryDto {
  id: string;
  date: string;
  averageScore: number;
  positionName: string;
  criteria: EvaluationHistoryCriterionDto[];
}

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private http = inject(HttpClient);

  getCriteria(): Observable<CriterionDto[]> {
    return this.http.get<CriterionDto[]>(`${BASE_URL}/evaluation-criteria`);
  }

  createEvaluation(payload: EvaluationInsertPayload): Observable<EvaluationDto> {
    return this.http.post<EvaluationDto>(`${BASE_URL}/Evaluations`, payload);
  }

  getEvaluationsByEmployee(employeeId: string): Observable<EvaluationHistoryDto[]> {
    return this.http.get<EvaluationHistoryDto[]>(`${BASE_URL}/Employees/${employeeId}/evaluations`);
  }
}
