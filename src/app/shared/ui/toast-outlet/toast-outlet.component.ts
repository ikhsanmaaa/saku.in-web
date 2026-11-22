import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideInfo,
  LucideTriangleAlert,
  LucideX,
} from '@lucide/angular';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  readonly id: string;
  readonly type: ToastType;
  readonly title: string;
  readonly message?: string;
}

@Component({
  selector: 'app-toast-outlet',
  imports: [LucideCircleCheck, LucideCircleAlert, LucideTriangleAlert, LucideInfo, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="sp-toast-container"
      aria-live="polite"
      class="pointer-events-none fixed right-5 bottom-5 z-50 flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
    >
      @for (toast of toasts(); track toast.id) {
        <div
          role="alert"
          class="animate-enter pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl"
          style="background-color: var(--bg-surface); color: var(--text-primary);"
          [style.border-color]="accentColorFor(toast.type)"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style="background-color: var(--accent-soft);"
            [style.color]="accentColorFor(toast.type)"
          >
            @switch (toast.type) {
              @case ('success') {
                <svg lucideCircleCheck class="h-4 w-4" aria-hidden="true"></svg>
              }
              @case ('error') {
                <svg lucideCircleAlert class="h-4 w-4" aria-hidden="true"></svg>
              }
              @case ('warning') {
                <svg lucideTriangleAlert class="h-4 w-4" aria-hidden="true"></svg>
              }
              @default {
                <svg lucideInfo class="h-4 w-4" aria-hidden="true"></svg>
              }
            }
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="mt-0.5 text-xs leading-relaxed" style="color: var(--text-secondary);">
                {{ toast.message }}
              </p>
            }
          </div>

          <button
            type="button"
            aria-label="Tutup pesan"
            class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-1"
            style="color: var(--text-secondary);"
            (click)="dismissed.emit(toast.id)"
          >
            <svg lucideX class="h-4 w-4" aria-hidden="true"></svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastOutletComponent {
  readonly toasts = input<readonly ToastMessage[]>([]);
  readonly dismissed = output<string>();

  protected accentColorFor(type: ToastType): string {
    if (type === 'error') {
      return 'var(--debit)';
    }
    if (type === 'warning') {
      return 'var(--warn)';
    }
    return 'var(--accent)';
  }
}
