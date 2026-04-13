import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Department } from '@admin/interfaces/departments/department.interface';
import { SaveDepartment } from '@admin/interfaces/departments/save-department.interface';
import { BASE_URL } from '../../../utils/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${BASE_URL}/Departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${BASE_URL}/Departments/${id}`);
  }

  createDepartment(department: SaveDepartment): Observable<Department> {
    return this.http.post<Department>(`${BASE_URL}/Departments`, department);
  }

  updateDepartment(id: number, department: SaveDepartment): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/Departments/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/Departments/${id}`);
  }
}
