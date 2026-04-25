export interface CandidateDto {
  id: string;
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
  cvUrl: string;
}

export interface CandidateInsertDto {
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
}

export interface CandidateUpdateDto {
  id: string;
  names: string;
  lastNames: string;
  email?: string;
  phoneNumber: string;
}