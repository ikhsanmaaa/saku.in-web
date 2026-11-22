import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { ToastMessage, ToastType } from '@/shared/ui/toast-outlet/toast-outlet.component';

const DEFAULT_TOAST_DURATION_MS = 4500;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly destroyReference = inject(DestroyRef);
  private readonly toastsSignal = signal<readonly ToastMessage[]>([]);
  private readonly timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  private sequenceCounter = 0;

  readonly toasts = this.toastsSignal.asReadonly();

  constructor() {
    this.destroyReference.onDestroy(() => this.clear());
  }

  show(
    type: ToastType,
    title: string,
    message?: string,
    durationMilliseconds = DEFAULT_TOAST_DURATION_MS,
  ): string {
    this.sequenceCounter += 1;
    const toastId = `toast-${this.sequenceCounter}`;
    const nextToast: ToastMessage = { id: toastId, type, title, message };

    this.toastsSignal.update((currentToasts) => [...currentToasts, nextToast]);

    if (durationMilliseconds > 0) {
      const timerId = setTimeout(() => this.dismiss(toastId), durationMilliseconds);
      this.timerMap.set(toastId, timerId);
    }

    return toastId;
  }

  success(title: string, message?: string, durationMilliseconds = DEFAULT_TOAST_DURATION_MS): string {
    return this.show('success', title, message, durationMilliseconds);
  }

  error(title: string, message?: string, durationMilliseconds = DEFAULT_TOAST_DURATION_MS): string {
    return this.show('error', title, message, durationMilliseconds);
  }

  warning(title: string, message?: string, durationMilliseconds = DEFAULT_TOAST_DURATION_MS): string {
    return this.show('warning', title, message, durationMilliseconds);
  }

  info(title: string, message?: string, durationMilliseconds = DEFAULT_TOAST_DURATION_MS): string {
    return this.show('info', title, message, durationMilliseconds);
  }

  dismiss(toastId: string): void {
    const activeTimer = this.timerMap.get(toastId);
    if (activeTimer !== undefined) {
      clearTimeout(activeTimer);
      this.timerMap.delete(toastId);
    }
    this.toastsSignal.update((currentToasts) =>
      currentToasts.filter((toastItem) => toastItem.id !== toastId),
    );
  }

  clear(): void {
    for (const activeTimer of this.timerMap.values()) {
      clearTimeout(activeTimer);
    }
    this.timerMap.clear();
    this.toastsSignal.set([]);
  }
}
