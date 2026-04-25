import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeeListItem, EmployeeHistory } from '@admin/interfaces/employees/employee.interface';
import { SaveEmployee } from '@admin/interfaces/employees/save-employee.interface';
import { PaginatedResponse } from '@shared/interfaces/paginated-response.interface';
import { BASE_URL } from '../../../utils/constants';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);

  getAllEmployees(page = 1, pageSize = 10, isActive?: boolean): Observable<PaginatedResponse<EmployeeListItem>> {
    const params: Record<string, string | number | boolean> = { page, pageSize };
    if (isActive !== undefined) params['isActive'] = isActive;
    return this.http.get<PaginatedResponse<EmployeeListItem>>(`${BASE_URL}/Employees`, { params });
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${BASE_URL}/Employees/${id}`);
  }

  createEmployee(employee: SaveEmployee): Observable<Employee> {
    return this.http.post<Employee>(`${BASE_URL}/Employees`, employee);
  }

  updateEmployee(id: string, employee: SaveEmployee): Observable<Employee> {
    return this.http.put<Employee>(`${BASE_URL}/Employees/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/Employees/${id}`);
  }

  getEmployeeHistory(id: string): Observable<EmployeeHistory[]> {
    return this.http.get<EmployeeHistory[]>(`${BASE_URL}/Employees/${id}/history`);
  }

  getEmployeeEvaluations(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/Employees/${id}/evaluations`);
  }
}
