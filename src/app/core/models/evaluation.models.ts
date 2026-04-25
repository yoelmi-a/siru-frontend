export interface EvaluationDto {
  id: string;
  employeeId: string;
  employeeFullName: string;
  positionName: string;
  date: string;
  averageScore: number;
  criteria: EvaluationDetailDto[];
}

export interface EvaluationInsertDto {
  employeeId: string;
  evaluationDate: string;
  criteria: EvaluationCriterionInsertDto[];
}

export interface EvaluationCriterionInsertDto {
  criterionId: number;
  score: number;
  observation?: string;
}

export interface EvaluationDetailDto {
  criterionId: number;
  criterionName: string;
  score: number;
  observation: string | null;
}

export interface CriterionDto {
  id: number;
  name: string;
}

export interface CriterionInsertDto {
  name: string;
}

export interface CriterionUpdateDto {
  name: string;
}