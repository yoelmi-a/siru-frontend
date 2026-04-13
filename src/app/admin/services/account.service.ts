import { Account, EditAccount } from '@admin/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProblemDetails } from '@auth/interfaces/problem-details.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const baseUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private _errorMessage = signal<string | null>(null);
  errorMessage = this._errorMessage.asReadonly();

  register(account: Account): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.post<void>(`${baseUrl}/accounts/register`, account)
    .pipe(
      map(resp => true),
      catchError((error: any) => this.handleError(error))
    );
  }

  edit(account: EditAccount): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.patch<void>(`${baseUrl}/accounts/edit`, account)
    .pipe(
      map(resp => true),
      catchError((error: any) => this.handleError(error))
    );
  }

  changeStatus(accountId: string): Observable<boolean> {
    this._errorMessage.set(null);
    return this.http.patch<void>(`${baseUrl}/accounts/change-status`, {
      accountId: accountId
    })
    .pipe(
      map(resp => true),
      catchError((error: any) => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<boolean> {
    // this.logout();
    const problemDetails: ProblemDetails = error.error;
    const message = problemDetails.detail ?? problemDetails?.title ?? 'Error desconocido';
    this._errorMessage.set(message); // 👈 guardar el mensaje
    return of(false);
  }

}
