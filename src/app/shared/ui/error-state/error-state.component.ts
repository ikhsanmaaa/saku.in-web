import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideRefreshCw } from '@lucide/angular';
import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'app-error-state',
  imports: [ZardAlertComponent, ZardButtonComponent, LucideRefreshCw],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-alert
      zType="destructive"
      zRole="alert"
      class="sp-surface rounded-2xl border p-5"
      style="border-color: var(--debit);"
      [zTitle]="title()"
      [zDescription]="message()"
      [zAction]="showRetry() ? retryTemplate : undefined"
    />
    <ng-template #retryTemplate>
      @if (showRetry()) {
        <button
          z-button
          zType="outline"
          type="button"
          class="sp-btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
          (click)="retried.emit()"
        >
          <svg lucideRefreshCw class="h-3.5 w-3.5" aria-hidden="true"></svg>
          <span>{{ retryLabel() }}</span>
        </button>
      }
    </ng-template>
  `,
})
export class ErrorStateComponent {
  readonly title = input<string>('Terjadi kesalahan');
  readonly message = input.required<string>();
  readonly retryLabel = input<string>('Coba lagi');
  readonly showRetry = input<boolean>(true);
  readonly retried = output<void>();
}
