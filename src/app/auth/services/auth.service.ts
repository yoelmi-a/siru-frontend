import { environment } from '../../../environments/environment';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ProblemDetails } from '../interfaces/problem-details.interface';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';

const ACCESS_TOKEN_KEY = 'sirus_access_token';
const REFRESH_TOKEN_KEY = 'sirus_refresh_token';

export enum Role {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  private _currentUser = signal<JwtPayload | null>(this.decodeToken());
  private http = inject(HttpClient);
  private _errorMessage = signal<string | null>(null);

  errorMessage = this._errorMessage.asReadonly();
  currentUser = this._currentUser.asReadonly();
  token = computed(() => this._token());
  hasAdminRole = computed(() => this._currentUser()?.roles?.includes('Admin') ?? false);
  hasSupervisorRole = computed(() =>
    (this._currentUser()?.roles?.includes('Admin') ?? false) ||
    (this._currentUser()?.roles?.includes('Supervisor') ?? false)
  );

  login(email: string, password: string): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.post<string>(`${environment.authUrl}/auth/login`, {
      email,
      password
    }, { withCredentials: true }).pipe(
      map(token => {
        this.saveToken(token);
        return true;
      }),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this._errorMessage.set(null);
    const origin = window.location.origin;
    return this.http.post<void>(`${environment.authUrl}/auth/forgot-password`, {
      email,
      origin
    }).pipe(
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  resetPassword(password: string, accountId: string, token: string): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.post<void>(`${environment.authUrl}/auth/reset-password`, {
      password,
      accountId,
      token
    }).pipe(
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<string>(`${environment.authUrl}/auth/refresh`, {
      jwtToken: this._token()
    }, { withCredentials: true }).pipe(
      map(token => {
        this.saveToken(token);
        return token;
      })
    );
  }

  logout(): void {
    this.http.post<void>(`${environment.authUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
    this.clearToken();
  }

  getCurrentUser(): JwtPayload | null {
    return this._currentUser();
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.roles?.includes(role) ?? false;
  }

  isAuthenticated(): boolean {
    const token = this._token();
    if (!token) return false;

    const decoded = this.decodeToken();
    if (!decoded) return false;

    const exp = decoded.exp * 1000;
    return Date.now() < exp;
  }

  hasClerkPermission(): boolean {
    return false;
  }

  hasDeliveryPermission(): boolean {
    return false;
  }

  private saveToken(token: string): void {
    this._token.set(token);
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this._currentUser.set(this.decodeToken());
  }

  private clearToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this._token.set(null);
    this._currentUser.set(null);
  }

  private decodeToken(): JwtPayload | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  private handleAuthError(error: any): Observable<boolean> {
    const problemDetails: ProblemDetails = error.error;
    const message = problemDetails?.detail ?? problemDetails?.title ?? 'Error desconocido';
    this._errorMessage.set(message);
    return of(false);
  }
}