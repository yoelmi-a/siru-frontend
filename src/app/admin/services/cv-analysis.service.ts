import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface CandidateRanking {
  candidateId: string;
  candidateName: string;
  score: number;
  extractedSkills: string[];
  experienceYears: number;
}

@Injectable({ providedIn: 'root' })
export class CvAnalysisService {

  // HU-04 y HU-05: Calcular y Ver Ranking
  getRankingForVacant(vacantId: string): Observable<CandidateRanking[]> {
    // Mock de resultados procesados por IA
    const mockRanking: CandidateRanking[] = [
      { candidateId: 'c-1', candidateName: 'María Santos', score: 95, experienceYears: 5, extractedSkills: ['Angular', 'C#', 'SQL Server', 'Liderazgo'] },
      { candidateId: 'c-2', candidateName: 'Pedro Ramirez', score: 82, experienceYears: 3, extractedSkills: ['Angular', 'C#', 'Node.js'] },
      { candidateId: 'c-3', candidateName: 'Luis Fernandez', score: 60, experienceYears: 1, extractedSkills: ['HTML', 'CSS', 'JavaScript'] },
    ];
    return of(mockRanking).pipe(delay(800));
  }

  // HU-02 y HU-03: Subir CV y extraer info
  uploadAndAnalyzeCv(candidateId: string, file: File): Observable<{ success: boolean, extractedData: any }> {
    // Simula el análisis con IA que toma algo de tiempo
    const mockExtractedData = {
      experienceYears: Math.floor(Math.random() * 8) + 1,
      skills: ['Comunicación', 'Resolución de Problemas', 'Angular'],
      education: 'Ingeniería en Sistemas (Simulado)'
    };
    return of({ success: true, extractedData: mockExtractedData }).pipe(delay(1500));
  }
}
