export interface SaveEmployee {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId?: string;
  positionId?: string;
  hireDate: string;
  candidateId?: string; // Si viene de una postulación/reclutamiento
}