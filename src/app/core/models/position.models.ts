export interface PositionDto {
  id: number;
  name: string;
  salary: number;
  departmentId: number;
  departmentName: string;
}

export interface PositionInsertDto {
  name: string;
  salary: number;
  departmentId: number;
}

export interface PositionUpdateDto {
  name: string;
  salary: number;
  departmentId: number;
}