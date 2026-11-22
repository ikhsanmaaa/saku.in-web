import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../layout/toast.service';
import { ApiError } from './api-error.model';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpController: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpController.verify();
    toastService.clear();
  });

  it('should map 400 WebResponse with multi-field errors into fieldErrors', () => {
    let capturedError: ApiError | undefined;

    httpClient.post('/api/transactions/topup', {}).subscribe({
      error: (error) => {
        capturedError = error as ApiError;
      },
    });

    const testRequest = httpController.expectOne('/api/transactions/topup');
    testRequest.flush(
      { data: null, errors: 'amount: must be at least 0.01; note: too long' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(capturedError?.status).toBe(400);
    expect(capturedError?.fieldErrors).toEqual({
      amount: 'must be at least 0.01',
      note: 'too long',
    });
    expect(toastService.toasts().length).toBe(0);
  });

  it('should handle 401 with empty body without throwing JSON parse error', () => {
    let capturedError: ApiError | undefined;

    httpClient.get('/api/wallet/me').subscribe({
      error: (error) => {
        capturedError = error as ApiError;
      },
    });

    const testRequest = httpController.expectOne('/api/wallet/me');
    testRequest.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(capturedError?.status).toBe(401);
    expect(capturedError?.message).toBe('Sesi berakhir. Silakan masuk kembali.');
    expect(toastService.toasts().length).toBe(0);
  });

  it('should map 403 and show error toast', () => {
    let capturedError: ApiError | undefined;

    httpClient.post('/api/admin/reversals', {}).subscribe({
      error: (error) => {
        capturedError = error as ApiError;
      },
    });

    const testRequest = httpController.expectOne('/api/admin/reversals');
    testRequest.flush(
      { data: null, errors: 'Access denied' },
      { status: 403, statusText: 'Forbidden' },
    );

    expect(capturedError?.status).toBe(403);
    expect(capturedError?.message).toBe('Access denied');
    expect(toastService.toasts().length).toBe(1);
    expect(toastService.toasts()[0].type).toBe('error');
  });

  it('should map 404 and 409 WebResponse errors without global toast', () => {
    let notFoundError: ApiError | undefined;
    let conflictError: ApiError | undefined;

    httpClient.post('/api/transactions/transfer', {}).subscribe({
      error: (error) => {
        notFoundError = error as ApiError;
      },
    });
    httpController
      .expectOne('/api/transactions/transfer')
      .flush({ data: null, errors: 'Receiver not found' }, { status: 404, statusText: 'Not Found' });

    httpClient.post('/api/auth/register', {}).subscribe({
      error: (error) => {
        conflictError = error as ApiError;
      },
    });
    httpController
      .expectOne('/api/auth/register')
      .flush({ data: null, errors: 'Username already taken' }, { status: 409, statusText: 'Conflict' });

    expect(notFoundError?.status).toBe(404);
    expect(notFoundError?.message).toBe('Receiver not found');
    expect(conflictError?.status).toBe(409);
    expect(conflictError?.message).toBe('Username already taken');
    expect(toastService.toasts().length).toBe(0);
  });

  it('should map 422 RISK_DENIED and 429 Retry-After header', () => {
    let riskError: ApiError | undefined;
    let rateLimitError: ApiError | undefined;

    httpClient.post('/api/transactions/transfer', {}).subscribe({
      error: (error) => {
        riskError = error as ApiError;
      },
    });
    httpController
      .expectOne('/api/transactions/transfer')
      .flush(
        { data: null, errors: 'RISK_DENIED: Daily limit exceeded' },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

    httpClient.post('/api/auth/login', {}).subscribe({
      error: (error) => {
        rateLimitError = error as ApiError;
      },
    });
    httpController.expectOne('/api/auth/login').flush(
      { data: null, errors: 'Too many login attempts' },
      {
        status: 429,
        statusText: 'Too Many Requests',
        headers: new HttpHeaders({ 'Retry-After': '45' }),
      },
    );

    expect(riskError?.status).toBe(422);
    expect(riskError?.code).toBe('RISK_DENIED');
    expect(rateLimitError?.status).toBe(429);
    expect(rateLimitError?.retryAfterSeconds).toBe(45);
  });

  it('should map 500 and network status 0 to safe generic messages with toast', () => {
    let serverError: ApiError | undefined;
    let networkError: ApiError | undefined;

    httpClient.get('/api/wallet/me').subscribe({
      error: (error) => {
        serverError = error as ApiError;
      },
    });
    httpController
      .expectOne('/api/wallet/me')
      .flush({ data: null, errors: 'NullPointerException at line 42' }, { status: 500, statusText: 'Server Error' });

    httpClient.get('/api/wallet/me').subscribe({
      error: (error) => {
        networkError = error as ApiError;
      },
    });
    httpController.expectOne('/api/wallet/me').error(new ProgressEvent('error'));

    expect(serverError?.status).toBe(500);
    expect(serverError?.message).not.toContain('NullPointerException');
    expect(networkError?.status).toBe(0);
    expect(toastService.toasts().length).toBe(2);
  });
});
