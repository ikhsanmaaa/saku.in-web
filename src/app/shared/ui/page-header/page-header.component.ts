import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        @if (badge()) {
          <span
            class="mb-2 inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wider uppercase"
            style="background-color: var(--accent-soft); color: var(--text-primary); border-color: var(--border-strong);"
          >
            {{ badge() }}
          </span>
        }
        <h1 class="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {{ title() }}
        </h1>
        @if (subtitle()) {
          <p class="mt-1 text-sm" style="color: var(--text-secondary);">
            {{ subtitle() }}
          </p>
        }
      </div>
      <div class="flex items-center gap-2">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly badge = input<string | undefined>(undefined);
}
