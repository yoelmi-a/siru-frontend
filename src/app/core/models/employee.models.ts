export interface EmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  cedula: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string | null;
  isActive: boolean;
}

export interface EmployeeListDto {
  id: string;
  fullName: string;
  cedula: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface EmployeeInsertDto {
  firstName: string;
  lastName: string;
  address: string;
  cedula: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string;
}

export interface EmployeeUpdateDto {
  firstName: string;
  lastName: string;
  address: string;
  cedula: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string;
}

export interface EmployeeHistoryDto {
  positionName: string;
  departmentName: string;
  startDate: string;
  endDate: string | null;
}

export interface EmployeePositionInsertDto {
  employeeId: string;
  positionId: number;
  startDate?: string;
}

export interface EmployeePositionDto {
  id: number;
  employeeId: string;
  employeeFullName: string;
  positionId: number;
  positionName: string;
  departmentName: string;
  startDate: string;
  endDate: string | null;
}

export interface EvaluationHistoryDto {
  id: string;
  date: string;
  averageScore: number;
  positionName: string;
  criteria: EvaluationHistoryCriterionDto[];
}

export interface EvaluationHistoryCriterionDto {
  name: string;
  score: number;
  observation: string | null;
}

export interface EmployeeQueryParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean | null;
}