import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let authStore: AuthStore;
  let httpController: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    authStore = TestBed.inject(AuthStore);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    sessionStorage.clear();
  });

  it('should preserve existing refreshToken when refresh response omits new refreshToken', () => {
    sessionStorage.setItem('sakuin_refresh_token', 'original-refresh-token');

    let newAccessToken: string | undefined;
    authStore.refreshAccessToken().subscribe((token) => {
      newAccessToken = token;
    });

    const refreshRequest = httpController.expectOne('/api/auth/refresh');
    expect(refreshRequest.request.body).toEqual({ refreshToken: 'original-refresh-token' });
    refreshRequest.flush({
      data: { accessToken: 'new-access-token' },
      errors: null,
    });

    expect(newAccessToken).toBe('new-access-token');
    expect(authStore.accessToken()).toBe('new-access-token');
    expect(authStore.getRefreshToken()).toBe('original-refresh-token');
  });

  it('should bootstrap session from stored refreshToken and load current user', async () => {
    sessionStorage.setItem('sakuin_refresh_token', 'stored-refresh');

    const bootstrapPromise = authStore.bootstrapSession();

    const refreshRequest = httpController.expectOne('/api/auth/refresh');
    refreshRequest.flush({
      data: { accessToken: 'bootstrapped-access' },
      errors: null,
    });

    await Promise.resolve();
    const userRequest = httpController.expectOne('/api/users/me');
    userRequest.flush({
      data: {
        id: 'user-alice',
        username: 'alice',
        email: 'alice@saku.in',
        phoneNumber: null,
        role: 'ADMIN',
      },
      errors: null,
    });

    await bootstrapPromise;

    expect(authStore.initialized()).toBe(true);
    expect(authStore.isAuthenticated()).toBe(true);
    expect(authStore.isAdmin()).toBe(true);
    expect(authStore.user()?.username).toBe('alice');
  });

  it('should clear session silently when bootstrap refresh fails', async () => {
    sessionStorage.setItem('sakuin_refresh_token', 'expired-refresh');

    const bootstrapPromise = authStore.bootstrapSession();

    const refreshRequest = httpController.expectOne('/api/auth/refresh');
    refreshRequest.flush(null, { status: 401, statusText: 'Unauthorized' });

    await bootstrapPromise;

    expect(authStore.initialized()).toBe(true);
    expect(authStore.isAuthenticated()).toBe(false);
    expect(authStore.getRefreshToken()).toBeNull();
  });
});
