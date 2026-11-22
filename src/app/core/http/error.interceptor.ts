import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../layout/toast.service';
import { ApiError, parseFieldErrors } from './api-error.model';
import { isWebResponse } from './web-response.model';

function extractServerMessage(httpError: HttpErrorResponse): string | null {
  if (isWebResponse(httpError.error) && typeof httpError.error.errors === 'string') {
    const trimmedMessage = httpError.error.errors.trim();
    return trimmedMessage.length > 0 ? trimmedMessage : null;
  }
  return null;
}

function parseRetryAfterSeconds(httpError: HttpErrorResponse): number | undefined {
  const headerValue = httpError.headers?.get('Retry-After');
  if (!headerValue) {
    return undefined;
  }
  const parsedSeconds = Number.parseInt(headerValue, 10);
  return Number.isFinite(parsedSeconds) && parsedSeconds > 0 ? parsedSeconds : undefined;
}

function extractRiskCode(serverMessage: string | null): string | undefined {
  if (!serverMessage) {
    return undefined;
  }
  if (serverMessage.includes('RISK_DENIED')) {
    return 'RISK_DENIED';
  }
  return undefined;
}

function mapHttpError(httpError: HttpErrorResponse, toastService: ToastService): ApiError {
  const serverMessage = extractServerMessage(httpError);

  if (httpError.status === 0) {
    const message = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
    toastService.error('Koneksi gagal', message);
    return new ApiError({ status: 0, message });
  }

  if (httpError.status === 400) {
    const message = serverMessage ?? 'Permintaan tidak valid.';
    const fieldErrors = serverMessage ? parseFieldErrors(serverMessage) : undefined;
    return new ApiError({ status: 400, message, fieldErrors });
  }

  if (httpError.status === 401) {
    const message = serverMessage ?? 'Sesi berakhir. Silakan masuk kembali.';
    return new ApiError({ status: 401, message });
  }

  if (httpError.status === 403) {
    const message = serverMessage ?? 'Anda tidak memiliki izin untuk aksi ini.';
    toastService.error('Akses ditolak', message);
    return new ApiError({ status: 403, message });
  }

  if (httpError.status === 404) {
    const message = serverMessage ?? 'Data yang diminta tidak ditemukan.';
    return new ApiError({ status: 404, message });
  }

  if (httpError.status === 409) {
    const message = serverMessage ?? 'Terjadi konflik data. Periksa kembali input Anda.';
    return new ApiError({ status: 409, message });
  }

  if (httpError.status === 422) {
    const message = serverMessage ?? 'Permintaan ditolak oleh kebijakan risiko.';
    const code = extractRiskCode(serverMessage);
    return new ApiError({ status: 422, message, code });
  }

  if (httpError.status === 429) {
    const message = serverMessage ?? 'Terlalu banyak percobaan. Silakan tunggu sebentar.';
    const retryAfterSeconds = parseRetryAfterSeconds(httpError);
    return new ApiError({ status: 429, message, retryAfterSeconds });
  }

  const genericServerMessage = 'Terjadi gangguan pada server. Silakan coba beberapa saat lagi.';
  toastService.error('Gangguan server', genericServerMessage);
  return new ApiError({ status: httpError.status, message: genericServerMessage });
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastService = inject(ToastService);

  return next(request).pipe(
    catchError((caughtError: unknown) => {
      if (caughtError instanceof HttpErrorResponse) {
        return throwError(() => mapHttpError(caughtError, toastService));
      }
      return throwError(() => caughtError);
    }),
  );
};
