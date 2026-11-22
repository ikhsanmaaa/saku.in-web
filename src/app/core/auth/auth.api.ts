import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { WebResponse } from '../http/web-response.model';
import {
  ChangePasswordRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from './auth.models';

function unwrapResponse<TData>(response: WebResponse<TData>): TData {
  if (response.data === null) {
    throw new Error(response.errors ?? 'Empty response payload');
  }
  return response.data;
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly httpClient = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);

  register(payload: RegisterRequest): Observable<UserResponse> {
    return this.httpClient
      .post<WebResponse<UserResponse>>(`${this.appConfig.apiBaseUrl}/auth/register`, payload)
      .pipe(map(unwrapResponse));
  }

  login(payload: LoginRequest): Observable<TokenResponse> {
    return this.httpClient
      .post<WebResponse<TokenResponse>>(`${this.appConfig.apiBaseUrl}/auth/login`, payload)
      .pipe(map(unwrapResponse));
  }

  refresh(refreshToken: string): Observable<TokenResponse> {
    const payload: RefreshRequest = { refreshToken };
    return this.httpClient
      .post<WebResponse<TokenResponse>>(`${this.appConfig.apiBaseUrl}/auth/refresh`, payload)
      .pipe(map(unwrapResponse));
  }

  logout(): Observable<void> {
    return this.httpClient
      .post<void>(`${this.appConfig.apiBaseUrl}/auth/logout`, {})
      .pipe(map(() => undefined));
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    return this.httpClient
      .post<void>(`${this.appConfig.apiBaseUrl}/auth/change-password`, payload)
      .pipe(map(() => undefined));
  }

  fetchCurrentUser(): Observable<UserResponse> {
    return this.httpClient
      .get<WebResponse<UserResponse>>(`${this.appConfig.apiBaseUrl}/users/me`)
      .pipe(map(unwrapResponse));
  }
}
