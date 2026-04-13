export interface Employee {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId?: string;
  positionId?: string;
  hireDate: string;
  status: 'Activo' | 'Inactivo';
  history?: EmployeeHistory[];
}

export interface EmployeeHistory {
  id: string;
  positionName: string;
  departmentName: string;
  startDate: string;
  endDate: string | null;
}
