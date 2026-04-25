export interface AuthDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  uid: string;
  jti?: string;
  email: string;
  fullName: string;
  roles: string[];
  exp: number;
}

export interface UserSessionDto {
  id: string;
  deviceInfo: string;
}

export interface GetAccountDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  idCard: string;
  isVerified: boolean;
  role: string;
  phoneNumber: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface ProblemDetails {
  statusCode: number;
  title: string;
  detail: string;
  instance: string;
}

export interface RefreshRequest {
  jwtToken: string;
}

export interface ForgotPasswordDto {
  email: string;
  origin: string;
}

export interface ResetPasswordDto {
  password: string;
  accountId: string;
  token: string;
}

export interface RevokeAccessRequestDto {
  sessionId: string;
  actionMadeByAccountId: string;
}

export interface RevokeSessionRequest {
  sessionId: string;
}

export interface SaveAccountDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
  idCard: string;
  role: 'Admin' | 'Supervisor';
  phoneNumber?: string;
}

export interface EditAccountDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  idCard: string;
  role: 'Admin' | 'Supervisor';
  phoneNumber?: string;
}

export interface ChangeStatusDto {
  accountId: string;
}

export interface PaginatedQueryParams {
  page?: number;
  pageSize?: number;
}