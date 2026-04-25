export interface JwtPayload {
  sub: string;
  uid: string;
  jti?: string;
  email: string;
  fullName: string;
  roles: string[];
  exp: number;
}