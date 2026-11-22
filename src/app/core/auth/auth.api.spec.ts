import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthApi } from './auth.api';
import { TokenResponse, UserResponse } from './auth.models';

describe('AuthApi', () => {
  let authApi: AuthApi;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    authApi = TestBed.inject(AuthApi);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should post login credentials and unwrap TokenResponse', () => {
    let result: TokenResponse | undefined;

    authApi.login({ username: 'alice', password: 'Password123' }).subscribe((response) => {
      result = response;
    });

    const testRequest = httpController.expectOne('/api/auth/login');
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual({ username: 'alice', password: 'Password123' });
    testRequest.flush({
      data: { accessToken: 'access-jwt', refreshToken: 'refresh-jwt' },
      errors: null,
    });

    expect(result).toEqual({ accessToken: 'access-jwt', refreshToken: 'refresh-jwt' });
  });

  it('should post register payload and unwrap UserResponse', () => {
    let result: UserResponse | undefined;

    authApi
      .register({
        username: 'dina',
        name: 'Dina Kusuma',
        email: 'dina@saku.in',
        password: 'Password123',
      })
      .subscribe((response) => {
        result = response;
      });

    const testRequest = httpController.expectOne('/api/auth/register');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush({
      data: {
        id: 'user-1',
        username: 'dina',
        email: 'dina@saku.in',
        phoneNumber: null,
        role: 'USER',
      },
      errors: null,
    });

    expect(result?.username).toBe('dina');
    expect(result?.role).toBe('USER');
  });

  it('should call logout and change-password endpoints with 204', () => {
    let logoutCompleted = false;
    let changePasswordCompleted = false;

    authApi.logout().subscribe(() => {
      logoutCompleted = true;
    });
    const logoutRequest = httpController.expectOne('/api/auth/logout');
    expect(logoutRequest.request.method).toBe('POST');
    logoutRequest.flush(null, { status: 204, statusText: 'No Content' });

    authApi
      .changePassword({
        oldPassword: 'Password123',
        newPassword: 'Password456',
        newConfirmPassword: 'Password456',
      })
      .subscribe(() => {
        changePasswordCompleted = true;
      });
    const changePasswordRequest = httpController.expectOne('/api/auth/change-password');
    expect(changePasswordRequest.request.method).toBe('POST');
    changePasswordRequest.flush(null, { status: 204, statusText: 'No Content' });

    expect(logoutCompleted).toBe(true);
    expect(changePasswordCompleted).toBe(true);
  });
});
