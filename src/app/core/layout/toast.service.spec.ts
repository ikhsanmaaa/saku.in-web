import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should enqueue and dismiss toasts by id', () => {
    TestBed.configureTestingModule({});
    const toastService = TestBed.inject(ToastService);

    const firstId = toastService.success('Top-up berhasil', 'Saldo bertambah.', 0);
    const secondId = toastService.error('Gagal', 'Saldo tidak cukup.', 0);

    expect(toastService.toasts().length).toBe(2);
    expect(toastService.toasts()[0].id).toBe(firstId);

    toastService.dismiss(firstId);
    expect(toastService.toasts().length).toBe(1);
    expect(toastService.toasts()[0].id).toBe(secondId);

    toastService.clear();
    expect(toastService.toasts().length).toBe(0);
  });

  it('should auto-dismiss toast after duration expires', () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    const toastService = TestBed.inject(ToastService);

    toastService.warning('Peringatan', 'Periksa ulang nominal.', 3000);
    expect(toastService.toasts().length).toBe(1);

    vi.advanceTimersByTime(3000);
    expect(toastService.toasts().length).toBe(0);
  });
});
