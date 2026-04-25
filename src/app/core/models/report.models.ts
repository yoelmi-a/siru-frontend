export interface HiringTimeReportDto {
  averageDays: number;
  totalClosedVacancies: number;
}

export interface DepartmentPerformanceDto {
  departmentName: string;
  averageScore: number;
  employeeCount: number;
}

export interface EmployeeReportDto {
  id: string;
  fullName: string;
  cedula: string;
  position: string;
  department: string;
  isActive: boolean;
}

export interface EmployeeReportQueryParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean | null;
}