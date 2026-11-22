import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';

interface BadgeStyle {
  readonly label: string;
  readonly backgroundColor: string;
  readonly textColor: string;
  readonly borderColor: string;
}

const STATUS_STYLE_MAP: Record<string, BadgeStyle> = {
  ACTIVE: {
    label: 'ACTIVE',
    backgroundColor: 'var(--credit-bg)',
    textColor: 'var(--credit)',
    borderColor: 'var(--border-strong)',
  },
  COMPLETED: {
    label: 'COMPLETED',
    backgroundColor: 'var(--credit-bg)',
    textColor: 'var(--credit)',
    borderColor: 'var(--border-strong)',
  },
  SUCCESS: {
    label: 'SUCCESS',
    backgroundColor: 'var(--credit-bg)',
    textColor: 'var(--credit)',
    borderColor: 'var(--border-strong)',
  },
  PASS: {
    label: 'PASS',
    backgroundColor: 'var(--credit-bg)',
    textColor: 'var(--credit)',
    borderColor: 'var(--border-strong)',
  },
  CLEAN: {
    label: 'CLEAN',
    backgroundColor: 'var(--credit-bg)',
    textColor: 'var(--credit)',
    borderColor: 'var(--border-strong)',
  },
  BLOCKED: {
    label: 'BLOCKED',
    backgroundColor: 'var(--debit-bg)',
    textColor: 'var(--debit)',
    borderColor: 'var(--debit)',
  },
  FAILED: {
    label: 'FAILED',
    backgroundColor: 'var(--debit-bg)',
    textColor: 'var(--debit)',
    borderColor: 'var(--debit)',
  },
  FAIL: {
    label: 'FAIL',
    backgroundColor: 'var(--debit-bg)',
    textColor: 'var(--debit)',
    borderColor: 'var(--debit)',
  },
  ISSUES_FOUND: {
    label: 'ISSUES FOUND',
    backgroundColor: 'var(--debit-bg)',
    textColor: 'var(--debit)',
    borderColor: 'var(--debit)',
  },
  PENDING: {
    label: 'PENDING',
    backgroundColor: 'var(--warn-bg)',
    textColor: 'var(--warn)',
    borderColor: 'var(--border-hairline)',
  },
  REVERSED: {
    label: 'REVERSED',
    backgroundColor: 'var(--accent-soft)',
    textColor: 'var(--accent)',
    borderColor: 'var(--border-strong)',
  },
  CANCELLED: {
    label: 'CANCELLED',
    backgroundColor: 'var(--bg-subtle)',
    textColor: 'var(--text-secondary)',
    borderColor: 'var(--border-hairline)',
  },
};

@Component({
  selector: 'app-status-badge',
  imports: [ZardBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-badge
      zType="outline"
      class="rounded-md px-2.5 py-0.5 font-mono text-xs font-bold"
      [style.background-color]="badgeStyle().backgroundColor"
      [style.color]="badgeStyle().textColor"
      [style.border-color]="badgeStyle().borderColor"
    >
      {{ displayLabel() }}
    </z-badge>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly label = input<string | undefined>(undefined);

  protected readonly badgeStyle = computed<BadgeStyle>(() => {
    const normalizedStatus = this.status().trim().toUpperCase();
    return (
      STATUS_STYLE_MAP[normalizedStatus] ?? {
        label: normalizedStatus,
        backgroundColor: 'var(--bg-subtle)',
        textColor: 'var(--text-secondary)',
        borderColor: 'var(--border-hairline)',
      }
    );
  });

  protected readonly displayLabel = computed<string>(
    () => this.label() ?? this.badgeStyle().label,
  );
}
