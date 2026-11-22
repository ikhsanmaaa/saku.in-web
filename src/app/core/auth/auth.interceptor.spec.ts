import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { forkJoin } from 'rxjs';
import { errorInterceptor } from '../http/error.interceptor';
import { authInterceptor } from './auth.interceptor';
import { AuthStore } from './auth.store';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpController: HttpTestingController;
  let authStore: AuthStore;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpController.verify();
    sessionStorage.clear();
  });

  it('should attach Bearer token to private /api requests and skip public auth endpoints', () => {
    authStore.setSessionTokens({ accessToken: 'token-123', refreshToken: 'refresh-123' });

    httpClient.get('/api/wallet/me').subscribe();
    const walletRequest = httpController.expectOne('/api/wallet/me');
    expect(walletRequest.request.headers.get('Authorization')).toBe('Bearer token-123');
    walletRequest.flush({ data: { balance: 1000 }, errors: null });

    httpClient.post('/api/auth/login', { username: 'alice', password: 'Password123' }).subscribe();
    const loginRequest = httpController.expectOne('/api/auth/login');
    expect(loginRequest.request.headers.has('Authorization')).toBe(false);
    loginRequest.flush({ data: { accessToken: 'a', refreshToken: 'r' }, errors: null });
  });

  it('should trigger only 1 refresh request when 3 parallel requests receive 401', () => {
    authStore.setSessionTokens({ accessToken: 'expired-token', refreshToken: 'valid-refresh' });

    const results: unknown[] = [];
    forkJoin([
      httpClient.get('/api/users/me'),
      httpClient.get('/api/wallet/me'),
      httpClient.get('/api/notifications'),
    ]).subscribe((responses) => {
      results.push(...responses);
    });

    const firstAttemptUsers = httpController.expectOne('/api/users/me');
    const firstAttemptWallet = httpController.expectOne('/api/wallet/me');
    const firstAttemptNotifications = httpController.expectOne('/api/notifications');

    firstAttemptUsers.flush(null, { status: 401, statusText: 'Unauthorized' });
    firstAttemptWallet.flush(null, { status: 401, statusText: 'Unauthorized' });
    firstAttemptNotifications.flush(null, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = httpController.expectOne('/api/auth/refresh');
    expect(refreshRequest.request.body).toEqual({ refreshToken: 'valid-refresh' });
    refreshRequest.flush({
      data: { accessToken: 'fresh-token' },
      errors: null,
    });

    const retriedUsers = httpController.expectOne('/api/users/me');
    const retriedWallet = httpController.expectOne('/api/wallet/me');
    const retriedNotifications = httpController.expectOne('/api/notifications');

    expect(retriedUsers.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    expect(retriedWallet.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    expect(retriedNotifications.request.headers.get('Authorization')).toBe('Bearer fresh-token');

    retriedUsers.flush({ data: { username: 'alice' }, errors: null });
    retriedWallet.flush({ data: { balance: 5000 }, errors: null });
    retriedNotifications.flush({ data: [], errors: null });

    expect(results.length).toBe(3);
  });

  it('should clear session and navigate to /login when refresh fails', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    authStore.setSessionTokens({ accessToken: 'expired-token', refreshToken: 'bad-refresh' });

    let failed = false;
    httpClient.get('/api/wallet/me').subscribe({
      error: () => {
        failed = true;
      },
    });

    httpController.expectOne('/api/wallet/me').flush(null, { status: 401, statusText: 'Unauthorized' });
    httpController.expectOne('/api/auth/refresh').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBe(true);
    expect(authStore.accessToken()).toBeNull();
    expect(authStore.getRefreshToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { reason: 'session-expired' },
    });
  });
});
