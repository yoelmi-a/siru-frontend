import { environment } from "src/environments/environment";
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { catchError, delay, map, Observable, of, tap } from "rxjs";
import { ProblemDetails } from "../interfaces/problem-details.interface";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@auth/interfaces/jwt-payload.interface";

const baseUrl = environment.apiUrl;

export enum Role {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'SuperAdmin',
  DELIVERY = 'Delivery',
  MECHANIC = 'Mechanic',
  CLERK = 'Clerk'
}

const ADMIN_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN, Role.OWNER];
const DELIVERY_ROLES: Role[] = [Role.DELIVERY, Role.MECHANIC];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _roles = signal<string[] | null>(this.loadRolesFromToken());
  private _user = signal<User | null>(null);
  private http = inject(HttpClient);
  private _errorMessage = signal<string | null>(null);


  errorMessage = this._errorMessage.asReadonly();
  hasAdminPermission = computed(() => this._roles()?.some(role => ADMIN_ROLES.includes(role as Role)) ?? false);
  hasDeliveryPermission = computed(() => this._roles()?.some(role => DELIVERY_ROLES.includes(role as Role)) ?? false);
  hasClerkPermission = computed(() => this._roles()?.includes(Role.CLERK) ?? false);
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.post<string>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this._errorMessage.set(null);
    var origin = window.location.origin;
    return this.http.post<void>(`${baseUrl}/auth/forgot-password`, {
      email: email,
      origin: origin
    }).pipe(
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  resetPassword(password: string, accountId: string, token: string): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.post<void>(`${baseUrl}/auth/reset-password`, {
      password: password,
      accountId: accountId,
      token: token
    }).pipe(
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<string>(`${baseUrl}/auth/refresh`, {
      jwtToken: this.token()
    },
  {
    withCredentials: true
  }).pipe(
      tap(resp => this.handleAuthSuccess(resp)),
    );
  }

  logout() {
    this.http.post('/auth/logout', {}, { withCredentials: true });
    console.log("AuthService logging out");
    this.deleteTokenAndRoles();
  }

  isAuthenticated(): boolean {
    if (this.token()) {
      return true;
    }
    return false;
  }

  private handleAuthSuccess(token: string) {
    // this._user.set(user);
    this.saveTokenAndRoles(token);
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    // this.logout();
    const problemDetails: ProblemDetails = error.error;
    const message = problemDetails.detail ?? problemDetails?.title ?? 'Error desconocido';
    this._errorMessage.set(message); // 👈 guardar el mensaje
    return of(false);
  }

  private saveTokenAndRoles(token: string): void {
    this._token.set(token);
    localStorage.setItem('token', token);
    this._roles.set(this.loadRolesFromToken());
  }

  private deleteTokenAndRoles(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this._roles.set(null);
  }

  private loadRolesFromToken(): string[] | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('decoded:', decoded);
      console.log('roles:', decoded.roles);
      return decoded.roles;
    } catch (e) {
      console.error('Error decodificando token:', e);
      return null;
    }
  }
}
