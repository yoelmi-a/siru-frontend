export interface VacantDto {
  id: string;
  title: string;
  description: string;
  profile: string;
  publicationDate: string;
  hiringDate: string | null;
  status: 'Open' | 'Closed' | 'Cancelled';
}

export interface SaveVacantDto {
  title: string;
  description: string;
  profile: string;
  positionId: number;
}

export interface UpdateVacantDto {
  title: string;
  description: string;
  profile: string;
  status: 'Open' | 'Closed' | 'Cancelled';
}

export interface VacancyApplicationDto {
  candidateNames: string;
  candidateLastNames: string;
  candidateEmail: string;
  candidatePhoneNumber: string;
  cvFile: File;
}

export interface VacancyApplicationResultDto {
  applicationId: string;
  vacantId: string;
  candidateId: string;
  candidateFullName: string;
  cvUrl: string;
  status: string;
  score: number;
}

export interface VacancyApplicationQueryParams {
  page?: number;
  pageSize?: number;
}