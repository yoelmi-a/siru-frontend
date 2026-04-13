import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
}

export interface EmployeeEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluatorId: string;
  date: string;
  scores: { criteriaId: string; criteriaName: string; score: number }[];
  averageScore: number;
  comments: string;
}

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  
  private mockCriteria: EvaluationCriteria[] = [
    { id: 'c-1', name: 'Responsabilidad', description: 'Cumplimiento de tareas a tiempo' },
    { id: 'c-2', name: 'Trabajo en Equipo', description: 'Colaboración con compañeros' },
    { id: 'c-3', name: 'Resolución de Problemas', description: 'Capacidad administrativa y lógica' },
  ];

  private mockEvaluations: EmployeeEvaluation[] = [
    {
      id: 'ev-1',
      employeeId: 'e-1',
      employeeName: 'Juan Pérez',
      evaluatorId: 'admin-1',
      date: '2024-03-01',
      scores: [
        { criteriaId: 'c-1', criteriaName: 'Responsabilidad', score: 90 },
        { criteriaId: 'c-2', criteriaName: 'Trabajo en Equipo', score: 85 },
        { criteriaId: 'c-3', criteriaName: 'Resolución de Problemas', score: 95 }
      ],
      averageScore: 90,
      comments: 'Excelente desempeño este trimestre.'
    }
  ];

  // HU-10 - Crear/Obtener criterios de evaluación
  getCriteria(): Observable<EvaluationCriteria[]> {
    return of(this.mockCriteria).pipe(delay(400));
  }

  // HU-12 - Ver evaluaciones de un empleado
  getEvaluationsByEmployee(employeeId: string): Observable<EmployeeEvaluation[]> {
    return of(this.mockEvaluations.filter(e => e.employeeId === employeeId)).pipe(delay(600));
  }

  // HU-11 y HU-13 - Registrar evaluación y generar resultado automático
  createEvaluation(payload: Omit<EmployeeEvaluation, 'id' | 'averageScore'>): Observable<EmployeeEvaluation> {
    const total = payload.scores.reduce((acc, curr) => acc + curr.score, 0);
    const avg = payload.scores.length > 0 ? (total / payload.scores.length) : 0;
    
    const newEval: EmployeeEvaluation = {
      ...payload,
      id: `ev-${Date.now()}`,
      averageScore: Math.round(avg * 10) / 10
    };
    
    this.mockEvaluations = [...this.mockEvaluations, newEval];
    return of(newEval).pipe(delay(500));
  }
}
