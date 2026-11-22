import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { isApiError } from '../http/api-error.model';
import { AuthStore } from './auth.store';

const IS_RETRY_REQUEST = new HttpContextToken<boolean>(() => false);

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

function isPublicAuthRequest(url: string, apiBaseUrl: string): boolean {
  return PUBLIC_AUTH_PATHS.some((path) => url.startsWith(`${apiBaseUrl}${path}`));
}

function isUnauthorizedError(caughtError: unknown): boolean {
  if (caughtError instanceof HttpErrorResponse) {
    return caughtError.status === 401;
  }
  return isApiError(caughtError) && caughtError.status === 401;
}

function withBearerToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) {
    return request;
  }
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const appConfig = inject(APP_CONFIG);

  if (!request.url.startsWith(appConfig.apiBaseUrl) || isPublicAuthRequest(request.url, appConfig.apiBaseUrl)) {
    return next(request);
  }

  const authorizedRequest = withBearerToken(request, authStore.accessToken());

  return next(authorizedRequest).pipe(
    catchError((caughtError: unknown) => {
      if (!isUnauthorizedError(caughtError) || request.context.get(IS_RETRY_REQUEST)) {
        return throwError(() => caughtError);
      }

      return authStore.refreshAccessToken().pipe(
        switchMap((newAccessToken) => {
          const retriedRequest = withBearerToken(
            request.clone({
              context: request.context.set(IS_RETRY_REQUEST, true),
            }),
            newAccessToken,
          );
          return next(retriedRequest);
        }),
        catchError((refreshError: unknown) => {
          authStore.clearSession();
          void router.navigate(['/login'], { queryParams: { reason: 'session-expired' } });
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
