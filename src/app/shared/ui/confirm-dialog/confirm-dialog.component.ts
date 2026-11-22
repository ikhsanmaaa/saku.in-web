import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { LucideX } from '@lucide/angular';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

export interface ConfirmDialogRow {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
  readonly highlight?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [LucideX, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'handleKeydown($event)',
  },
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          tabindex="-1"
          aria-label="Tutup dialog"
          class="fixed inset-0 bg-black/75 backdrop-blur-xs"
          (click)="requestCancel()"
        ></button>
        <div
          #dialogContainer
          role="dialog"
          aria-modal="true"
          aria-labelledby="sp-confirm-dialog-title"
          tabindex="-1"
          class="animate-enter relative z-10 w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
          style="background-color: var(--bg-surface); border-color: var(--border-strong); color: var(--text-primary);"
        >
          <div
            class="flex items-start justify-between gap-3 border-b p-5"
            style="border-color: var(--border-hairline);"
          >
            <div>
              <h3 id="sp-confirm-dialog-title" class="font-display text-lg font-bold">
                {{ title() }}
              </h3>
              @if (subtitle()) {
                <p class="mt-1 text-xs" style="color: var(--text-secondary);">
                  {{ subtitle() }}
                </p>
              }
            </div>
            <button
              type="button"
              aria-label="Tutup dialog"
              class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2"
              style="color: var(--text-secondary);"
              [disabled]="isSubmitting()"
              (click)="requestCancel()"
            >
              <svg lucideX class="h-4 w-4" aria-hidden="true"></svg>
            </button>
          </div>

          <div class="space-y-3 p-5">
            @if (rows().length > 0) {
              <div
                class="divide-y rounded-2xl border"
                style="background-color: var(--bg-elevated); border-color: var(--border-hairline);"
              >
                @for (row of rows(); track row.label) {
                  <div
                    class="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                    style="border-color: var(--border-hairline);"
                  >
                    <span style="color: var(--text-secondary);">{{ row.label }}</span>
                    <span
                      class="text-right font-bold tabular-nums"
                      [class.font-mono]="row.mono"
                      [class.text-xs]="row.mono"
                      [class.text-base]="row.highlight"
                      [style.color]="row.highlight ? 'var(--accent)' : 'var(--text-primary)'"
                    >
                      {{ row.value }}
                    </span>
                  </div>
                }
              </div>
            }

            @if (idempotencyKey()) {
              <div
                class="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 font-mono text-[11px]"
                style="background-color: var(--bg-subtle); color: var(--text-secondary);"
              >
                <span class="shrink-0">Idempotency-Key:</span>
                <span class="truncate font-bold" style="color: var(--accent);">
                  {{ idempotencyKey() }}
                </span>
              </div>
            }
          </div>

          <div
            class="flex items-center justify-end gap-2.5 border-t px-5 py-4"
            style="background-color: var(--bg-elevated); border-color: var(--border-hairline);"
          >
            <button
              z-button
              zType="outline"
              type="button"
              class="sp-btn-secondary rounded-xl px-4 py-2.5 text-xs"
              [disabled]="isSubmitting()"
              (click)="requestCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              z-button
              [zType]="isDanger() ? 'destructive' : 'default'"
              type="button"
              class="min-h-[44px] rounded-xl px-5 py-2.5 text-xs font-bold"
              [style.background-color]="isDanger() ? 'var(--debit)' : 'var(--accent)'"
              [style.color]="isDanger() ? '#000000' : 'var(--accent-ink)'"
              [disabled]="isSubmitting()"
              (click)="confirmed.emit()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  private readonly documentReference = inject(DOCUMENT);
  private readonly dialogContainer = viewChild<ElementRef<HTMLElement>>('dialogContainer');

  readonly isOpen = input<boolean>(false);
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly rows = input<readonly ConfirmDialogRow[]>([]);
  readonly idempotencyKey = input<string | null>(null);
  readonly confirmLabel = input<string>('Konfirmasi');
  readonly cancelLabel = input<string>('Batal');
  readonly isDanger = input<boolean>(false);
  readonly isSubmitting = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        queueMicrotask(() => {
          this.dialogContainer()?.nativeElement.focus();
        });
      }
    });
  }

  protected requestCancel(): void {
    if (!this.isSubmitting()) {
      this.cancelled.emit();
    }
  }

  protected handleKeydown(keyboardEvent: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      this.requestCancel();
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.trapFocus(keyboardEvent);
    }
  }

  private trapFocus(keyboardEvent: KeyboardEvent): void {
    const container = this.dialogContainer()?.nativeElement;
    if (!container) {
      return;
    }

    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusableElements.length === 0) {
      keyboardEvent.preventDefault();
      container.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = this.documentReference.activeElement;

    if (keyboardEvent.shiftKey && (activeElement === firstElement || activeElement === container)) {
      keyboardEvent.preventDefault();
      lastElement.focus();
    } else if (!keyboardEvent.shiftKey && activeElement === lastElement) {
      keyboardEvent.preventDefault();
      firstElement.focus();
    }
  }
}
