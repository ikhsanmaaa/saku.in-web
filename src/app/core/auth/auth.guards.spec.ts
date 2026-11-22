import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth.store';
import { guestGuard } from './guest.guard';
import { roleGuard } from './role.guard';

describe('Auth Guards', () => {
  let authStore: AuthStore;
  const dummyRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
    });
    authStore = TestBed.inject(AuthStore);
    authStore.clearSession();
  });

  it('authGuard should redirect unauthenticated users to /login with returnUrl', () => {
    const state = { url: '/transactions/topup' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, state));

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/login?returnUrl=%2Ftransactions%2Ftopup');
  });

  it('authGuard should allow authenticated users', () => {
    authStore.setSessionTokens({ accessToken: 'token' });
    authStore.setUser({
      id: 'user-1',
      username: 'alice',
      email: 'alice@saku.in',
      phoneNumber: null,
      role: 'USER',
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(dummyRoute, { url: '/dashboard' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('guestGuard should redirect authenticated users to /dashboard', () => {
    authStore.setSessionTokens({ accessToken: 'token' });
    authStore.setUser({
      id: 'user-1',
      username: 'alice',
      email: 'alice@saku.in',
      phoneNumber: null,
      role: 'USER',
    });

    const result = TestBed.runInInjectionContext(() =>
      guestGuard(dummyRoute, { url: '/login' } as RouterStateSnapshot),
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/dashboard');
  });

  it('roleGuard should block non-ADMIN users and redirect to /403', () => {
    authStore.setSessionTokens({ accessToken: 'token' });
    authStore.setUser({
      id: 'user-1',
      username: 'budi',
      email: 'budi@saku.in',
      phoneNumber: null,
      role: 'USER',
    });

    const adminGuard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() =>
      adminGuard(dummyRoute, { url: '/admin/reversal' } as RouterStateSnapshot),
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/403');
  });

  it('roleGuard should allow ADMIN users', () => {
    authStore.setSessionTokens({ accessToken: 'token' });
    authStore.setUser({
      id: 'admin-1',
      username: 'alice',
      email: 'alice@saku.in',
      phoneNumber: null,
      role: 'ADMIN',
    });

    const adminGuard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() =>
      adminGuard(dummyRoute, { url: '/admin/reversal' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
