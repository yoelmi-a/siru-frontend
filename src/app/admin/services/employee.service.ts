import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Employee } from '../interfaces/employees/employee.interface';
import { SaveEmployee } from '../interfaces/employees/save-employee.interface';

// MOCK DATA PARA HU-06 a HU-09
let MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e-1',
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.com',
    phoneNumber: '809-123-4567',
    hireDate: '2022-01-15',
    status: 'Activo',
    history: [
      { id: 'h-1', positionName: 'Desarrollador Junior', departmentName: 'TI', startDate: '2022-01-15', endDate: '2024-01-01' },
      { id: 'h-2', positionName: 'Desarrollador Semi-Senior', departmentName: 'TI', startDate: '2024-01-02', endDate: null }
    ]
  },
  {
    id: 'e-2',
    name: 'Ana',
    lastName: 'Gómez',
    email: 'ana.gomez@empresa.com',
    phoneNumber: '849-987-6543',
    hireDate: '2023-05-20',
    status: 'Activo',
    history: [
      { id: 'h-3', positionName: 'Analista de QA', departmentName: 'TI', startDate: '2023-05-20', endDate: null }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  // HU-08 - Obtener todos
  getAllEmployees(): Observable<Employee[]> {
    return of([...MOCK_EMPLOYEES]).pipe(delay(500));
  }

  // Obtener por ID con su historial (HU-09)
  getEmployeeById(id: string): Observable<Employee> {
    if (id === 'new') {
      return of({
        id: '', name: '', lastName: '', email: '', phoneNumber: '',
        hireDate: new Date().toISOString().split('T')[0], status: 'Activo', history: []
      });
    }
    const emp = MOCK_EMPLOYEES.find(e => e.id === id);
    if (emp) {
      return of({...emp}).pipe(delay(500));
    }
    return throwError(() => new Error('Empleado no encontrado'));
  }

  // HU-06 - Registrar empleado
  createEmployee(payload: SaveEmployee): Observable<Employee> {
    const newEmployee: Employee = {
      id: `e-${Date.now()}`,
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      departmentId: payload.departmentId,
      positionId: payload.positionId,
      hireDate: payload.hireDate,
      status: 'Activo',
      history: payload.positionId ? [{
        id: `h-${Date.now()}`,
        positionName: payload.positionId, // Mock
        departmentName: payload.departmentId ?? 'N/A', // Mock
        startDate: payload.hireDate,
        endDate: null
      }] : []
    };
    
    MOCK_EMPLOYEES = [...MOCK_EMPLOYEES, newEmployee];
    return of(newEmployee).pipe(delay(500));
  }

  // HU-07 - Editar empleado
  updateEmployee(id: string, payload: SaveEmployee): Observable<void> {
    const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
    if (index === -1) return throwError(() => new Error('Empleado no encontrado'));

    MOCK_EMPLOYEES[index] = {
      ...MOCK_EMPLOYEES[index],
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };
    return of(undefined).pipe(delay(500));
  }

  deleteEmployee(id: string): Observable<void> {
    MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter(e => e.id !== id);
    return of(undefined).pipe(delay(500));
  }
}