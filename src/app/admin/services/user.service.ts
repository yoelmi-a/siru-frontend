import { Account } from '@admin/interfaces/account.interface';
import { User } from '@admin/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginatedResponse } from '@shared/interfaces/paginated-response.interface';
import { delay, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;

const emptyAccount: Account = {
  email: '',
  lastName: '',
  name: '',
  password: '',
  phoneNumber: '',
  role: '',
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getAllUsers(page: number, pageSize: number): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${baseUrl}/users/all`,
      {
        params: {
          page: page,
          pageSize: pageSize
        }
      }).pipe(tap(resp => console.log(resp)));
  }

  getAccountById(id: string): Observable<Account> {
    if (id === 'new') {
      return of(emptyAccount);
    }

    return this.http.get<User>(`${baseUrl}/users/${id}`).pipe(
      map((user): Account => ({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber ?? '',
        password: '',
        role: user.roles[0] ?? '',
      })),
      tap((user) => console.log(user))
    );
  }
}
