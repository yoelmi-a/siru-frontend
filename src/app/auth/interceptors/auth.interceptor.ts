import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { catchError, switchMap, throwError } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const authService = inject(AuthService);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authService.token()}`),
  });

  const router = inject(Router);

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      console.log("Retrying with new token")
      return authService.refreshToken().pipe(
        switchMap((newToken) => {
          const retryReq = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${newToken}`),
          });

          return next(retryReq);
        }),
        catchError((e) => {
          console.log(e);
          authService.logout();
          router.navigateByUrl('/auth/login');
          return throwError(() => error);
        })
      );
    })
  );
}
