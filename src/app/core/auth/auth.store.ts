import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  firstValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthApi } from './auth.api';
import { LoginRequest, TokenResponse, UserResponse } from './auth.models';

const REFRESH_TOKEN_STORAGE_KEY = 'sakuin_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authApi = inject(AuthApi);

  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<UserResponse | null>(null);
  private readonly initializedSignal = signal<boolean>(false);

  private refreshInFlight$: Observable<string> | null = null;

  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly initialized = this.initializedSignal.asReadonly();
  readonly isAuthenticated = computed(
    () => this.accessTokenSignal() !== null && this.userSignal() !== null,
  );
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

  getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  setSessionTokens(tokens: TokenResponse): void {
    this.accessTokenSignal.set(tokens.accessToken);
    if (typeof tokens.refreshToken === 'string' && tokens.refreshToken.length > 0) {
      try {
        sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
      } catch {
        // Ignore storage access errors in restricted environments
      }
    }
  }

  setUser(user: UserResponse): void {
    this.userSignal.set(user);
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.userSignal.set(null);
    try {
      sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
  }

  async bootstrapSession(): Promise<void> {
    const storedRefreshToken = this.getRefreshToken();
    if (!storedRefreshToken) {
      this.initializedSignal.set(true);
      return;
    }

    try {
      const tokens = await firstValueFrom(this.authApi.refresh(storedRefreshToken));
      this.setSessionTokens(tokens);
      const currentUser = await firstValueFrom(this.authApi.fetchCurrentUser());
      this.setUser(currentUser);
    } catch {
      this.clearSession();
    } finally {
      this.initializedSignal.set(true);
    }
  }

  login(payload: LoginRequest): Observable<UserResponse> {
    return this.authApi.login(payload).pipe(
      tap((tokens) => this.setSessionTokens(tokens)),
      switchMap(() => this.authApi.fetchCurrentUser()),
      tap((currentUser) => this.setUser(currentUser)),
    );
  }

  logout(): Observable<void> {
    return this.authApi.logout().pipe(
      catchError(() => of(undefined)),
      finalize(() => this.clearSession()),
    );
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const storedRefreshToken = this.getRefreshToken();
    if (!storedRefreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshInFlight$ = this.authApi.refresh(storedRefreshToken).pipe(
      tap((tokens) => this.setSessionTokens(tokens)),
      map((tokens) => tokens.accessToken),
      shareReplay(1),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
    );

    return this.refreshInFlight$;
  }
}
