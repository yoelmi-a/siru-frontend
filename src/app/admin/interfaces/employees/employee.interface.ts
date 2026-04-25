export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  cedula: string;
  phoneNumber: string;
  dateOfBirth: string;
  email?: string;
  isActive: boolean;
}

export interface EmployeeListItem {
  id: string;
  fullName: string;
  cedula: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface EmployeeHistory {
  positionName: string;
  departmentName: string;
  startDate: string;
  endDate: string | null;
}
