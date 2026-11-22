import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const IDR_NUMBER_FORMATTER = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Component({
  selector: 'app-money-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tabular-nums" [style.color]="textColor()">
      {{ formattedAmount() }}
    </span>
  `,
})
export class MoneyTextComponent {
  readonly amount = input.required<number>();
  readonly direction = input<'credit' | 'debit' | 'neutral'>('neutral');
  readonly showSign = input<boolean>(false);
  readonly isHidden = input<boolean>(false);

  protected readonly textColor = computed<string>(() => {
    const currentDirection = this.direction();
    if (currentDirection === 'credit') {
      return 'var(--credit)';
    }
    if (currentDirection === 'debit') {
      return 'var(--debit)';
    }
    return 'var(--text-primary)';
  });

  protected readonly formattedAmount = computed<string>(() => {
    if (this.isHidden()) {
      return 'Rp ••••••••';
    }
    const absoluteAmount = Math.abs(this.amount());
    const formattedNumber = IDR_NUMBER_FORMATTER.format(absoluteAmount);
    const signPrefix = this.resolveSignPrefix();
    return `${signPrefix}Rp ${formattedNumber}`;
  });

  private resolveSignPrefix(): string {
    if (!this.showSign()) {
      return this.amount() < 0 ? '-' : '';
    }
    if (this.direction() === 'credit') {
      return '+';
    }
    if (this.direction() === 'debit' || this.amount() < 0) {
      return '-';
    }
    return '';
  }
}
