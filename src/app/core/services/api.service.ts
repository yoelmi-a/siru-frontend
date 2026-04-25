import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  VacantDto, SaveVacantDto, UpdateVacantDto, VacancyApplicationDto,
  VacancyApplicationResultDto, VacancyApplicationQueryParams
} from '../models/vacancy.models';
import { CandidateDto, CandidateInsertDto, CandidateUpdateDto } from '../models/candidate.models';
import {
  EmployeeDto, EmployeeListDto, EmployeeInsertDto, EmployeeUpdateDto,
  EmployeeHistoryDto, EmployeePositionInsertDto, EmployeePositionDto,
  EvaluationHistoryDto, EmployeeQueryParams
} from '../models/employee.models';
import { PositionDto, PositionInsertDto, PositionUpdateDto } from '../models/position.models';
import { DepartmentDto, DepartmentInsertDto, DepartmentUpdateDto } from '../models/department.models';
import {
  EvaluationDto, EvaluationInsertDto, CriterionDto,
  CriterionInsertDto, CriterionUpdateDto
} from '../models/evaluation.models';
import {
  HiringTimeReportDto, DepartmentPerformanceDto, EmployeeReportDto, EmployeeReportQueryParams
} from '../models/report.models';
import {
  PaginatedResponse, GetAccountDto, UserSessionDto,
  SaveAccountDto, EditAccountDto, ChangeStatusDto, RefreshRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private authUrl = environment.authUrl;

  private getPaginationParams(page?: number, pageSize?: number): HttpParams {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    return params;
  }

// ============================================================
// VACANCIES
// ============================================================
  getVacancies(): Observable<VacantDto[]> {
    return this.http.get<VacantDto[]>(`${this.baseUrl}/vacancies`);
  }

  getVacancy(id: string): Observable<VacantDto> {
    return this.http.get<VacantDto>(`${this.baseUrl}/vacancies/${id}`);
  }

  createVacancy(dto: SaveVacantDto): Observable<VacantDto> {
    return this.http.post<VacantDto>(`${this.baseUrl}/vacancies`, dto);
  }

  updateVacancy(id: string, dto: UpdateVacantDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/vacancies/${id}`, dto);
  }

  deleteVacancy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vacancies/${id}`);
  }

  applyToVacancy(vacancyId: string, dto: VacancyApplicationDto): Observable<VacancyApplicationResultDto> {
    const formData = new FormData();
    formData.append('candidateNames', dto.candidateNames);
    formData.append('candidateLastNames', dto.candidateLastNames);
    formData.append('candidateEmail', dto.candidateEmail);
    formData.append('candidatePhoneNumber', dto.candidatePhoneNumber);
    formData.append('cvFile', dto.cvFile);
    return this.http.post<VacancyApplicationResultDto>(
      `${this.baseUrl}/vacancies/${vacancyId}/applications`, formData
    );
  }

  recalculateScores(vacancyId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/vacancies/${vacancyId}/recalculate-scores`, {});
  }

  getVacancyApplications(vacancyId: string, params?: VacancyApplicationQueryParams): Observable<PaginatedResponse<VacancyApplicationResultDto>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    return this.http.get<PaginatedResponse<VacancyApplicationResultDto>>(
      `${this.baseUrl}/vacancies/${vacancyId}/applications`,
      { params: httpParams }
    );
  }

// ============================================================
// CANDIDATES
// ============================================================
  getCandidates(): Observable<CandidateDto[]> {
    return this.http.get<CandidateDto[]>(`${this.baseUrl}/candidates`);
  }

  getCandidate(id: string): Observable<CandidateDto> {
    return this.http.get<CandidateDto>(`${this.baseUrl}/candidates/${id}`);
  }

  createCandidate(dto: CandidateInsertDto): Observable<CandidateDto> {
    return this.http.post<CandidateDto>(`${this.baseUrl}/candidates`, dto);
  }

  updateCandidate(id: string, dto: CandidateUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/candidates/${id}`, dto);
  }

  deleteCandidate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/candidates/${id}`);
  }

// ============================================================
// EMPLOYEES
// ============================================================
  getEmployees(params?: EmployeeQueryParams): Observable<PaginatedResponse<EmployeeListDto>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.isActive !== undefined && params?.isActive !== null) {
      httpParams = httpParams.set('isActive', params.isActive.toString());
    }
    return this.http.get<PaginatedResponse<EmployeeListDto>>(`${this.baseUrl}/employees`, { params: httpParams });
  }

  getEmployee(id: string): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(dto: EmployeeInsertDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(`${this.baseUrl}/employees`, dto);
  }

  updateEmployee(id: string, dto: EmployeeUpdateDto): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${this.baseUrl}/employees/${id}`, dto);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employees/${id}`);
  }

  getEmployeeHistory(id: string): Observable<EmployeeHistoryDto[]> {
    return this.http.get<EmployeeHistoryDto[]>(`${this.baseUrl}/employees/${id}/history`);
  }

  getEmployeeEvaluations(id: string): Observable<EvaluationHistoryDto[]> {
    return this.http.get<EvaluationHistoryDto[]>(`${this.baseUrl}/employees/${id}/evaluations`);
  }

  assignPosition(employeeId: string, dto: EmployeePositionInsertDto): Observable<EmployeePositionDto> {
    return this.http.post<EmployeePositionDto>(`${this.baseUrl}/employees/${employeeId}/positions`, dto);
  }

// ============================================================
// POSITIONS
// ============================================================
  getPositions(): Observable<PositionDto[]> {
    return this.http.get<PositionDto[]>(`${this.baseUrl}/positions`);
  }

  getPosition(id: number): Observable<PositionDto> {
    return this.http.get<PositionDto>(`${this.baseUrl}/positions/${id}`);
  }

  createPosition(dto: PositionInsertDto): Observable<PositionDto> {
    return this.http.post<PositionDto>(`${this.baseUrl}/positions`, dto);
  }

  updatePosition(id: number, dto: PositionUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/positions/${id}`, dto);
  }

  deletePosition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/positions/${id}`);
  }

// ============================================================
// DEPARTMENTS
// ============================================================
  getDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${this.baseUrl}/departments`);
  }

  getDepartment(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.baseUrl}/departments/${id}`);
  }

  createDepartment(dto: DepartmentInsertDto): Observable<DepartmentDto> {
    return this.http.post<DepartmentDto>(`${this.baseUrl}/departments`, dto);
  }

  updateDepartment(id: number, dto: DepartmentUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/departments/${id}`, dto);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/departments/${id}`);
  }

// ============================================================
// EVALUATIONS
// ============================================================
  createEvaluation(dto: EvaluationInsertDto): Observable<EvaluationDto> {
    return this.http.post<EvaluationDto>(`${this.baseUrl}/evaluations`, dto);
  }

// ============================================================
// EVALUATION CRITERIA
// ============================================================
  getCriteria(): Observable<CriterionDto[]> {
    return this.http.get<CriterionDto[]>(`${this.baseUrl}/evaluation-criteria`);
  }

  getCriterion(id: number): Observable<CriterionDto> {
    return this.http.get<CriterionDto>(`${this.baseUrl}/evaluation-criteria/${id}`);
  }

  createCriterion(dto: CriterionInsertDto): Observable<CriterionDto> {
    return this.http.post<CriterionDto>(`${this.baseUrl}/evaluation-criteria`, dto);
  }

  updateCriterion(id: number, dto: CriterionUpdateDto): Observable<CriterionDto> {
    return this.http.put<CriterionDto>(`${this.baseUrl}/evaluation-criteria/${id}`, dto);
  }

  deleteCriterion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evaluation-criteria/${id}`);
  }

// ============================================================
// REPORTS
// ============================================================
  getHiringTimeReport(): Observable<HiringTimeReportDto> {
    return this.http.get<HiringTimeReportDto>(`${this.baseUrl}/reports/hiring-time`);
  }

  getPerformanceByDepartment(): Observable<DepartmentPerformanceDto[]> {
    return this.http.get<DepartmentPerformanceDto[]>(`${this.baseUrl}/reports/performance-by-department`);
  }

  getEmployeeReport(params?: EmployeeReportQueryParams): Observable<PaginatedResponse<EmployeeReportDto>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.isActive !== undefined && params?.isActive !== null) {
      httpParams = httpParams.set('isActive', params.isActive.toString());
    }
    return this.http.get<PaginatedResponse<EmployeeReportDto>>(`${this.baseUrl}/reports/employees`, { params: httpParams });
  }

  exportHiringTimePdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/hiring-time/export`, { responseType: 'blob' });
  }

  exportPerformanceByDepartmentPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/performance-by-department/export`, { responseType: 'blob' });
  }

  exportEmployeesPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/employees/export`, { responseType: 'blob' });
  }

  downloadPdf(endpoint: string, filename: string): void {
    this.http.get(`${this.baseUrl}${endpoint}`, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

// ============================================================
// AUTH (Beyond SRS)
// ============================================================
  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.authUrl}/auth/login`, { email, password });
  }

  refreshToken(token: string): Observable<string> {
    return this.http.post<string>(`${this.authUrl}/auth/refresh`, { jwtToken: token } as RefreshRequest, {
      withCredentials: true
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/auth/logout`, {}, { withCredentials: true });
  }

  forgotPassword(email: string, origin: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/auth/forgot-password`, { email, origin });
  }

  resetPassword(password: string, accountId: string, token: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/auth/reset-password`, { password, accountId, token });
  }

  getMySessions(page = 1, pageSize = 10): Observable<PaginatedResponse<UserSessionDto>> {
    return this.http.get<PaginatedResponse<UserSessionDto>>(
      `${this.authUrl}/auth/me/sessions`,
      { params: this.getPaginationParams(page, pageSize) }
    );
  }

  revokeMySession(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/auth/me/revoke`, { sessionId });
  }

// ============================================================
// ACCOUNTS (Beyond SRS)
// ============================================================
  getAccountMe(): Observable<GetAccountDto> {
    return this.http.get<GetAccountDto>(`${this.authUrl}/accounts/me`);
  }

  getAccounts(page = 1, pageSize = 10): Observable<PaginatedResponse<GetAccountDto>> {
    return this.http.get<PaginatedResponse<GetAccountDto>>(
      `${this.authUrl}/accounts/all`,
      { params: this.getPaginationParams(page, pageSize) }
    );
  }

  getAccount(accountId: string): Observable<GetAccountDto> {
    return this.http.get<GetAccountDto>(`${this.authUrl}/accounts/${accountId}`);
  }

  registerAccount(dto: SaveAccountDto): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/accounts/register`, dto);
  }

  editAccount(dto: EditAccountDto): Observable<void> {
    return this.http.patch<void>(`${this.authUrl}/accounts/edit`, dto);
  }

  changeAccountStatus(dto: ChangeStatusDto): Observable<void> {
    return this.http.patch<void>(`${this.authUrl}/accounts/change-status`, dto);
  }
}