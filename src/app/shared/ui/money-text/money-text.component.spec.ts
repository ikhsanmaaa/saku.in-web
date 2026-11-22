import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MoneyTextComponent } from './money-text.component';

@Component({
  imports: [MoneyTextComponent],
  template: `
    <app-money-text
      [amount]="amount()"
      [direction]="direction()"
      [showSign]="showSign()"
      [isHidden]="isHidden()"
    />
  `,
})
class TestMoneyTextHostComponent {
  readonly amount = signal(150000);
  readonly direction = signal<'credit' | 'debit' | 'neutral'>('credit');
  readonly showSign = signal(true);
  readonly isHidden = signal(false);
}

describe('MoneyTextComponent', () => {
  it('should format IDR with tabular-nums and credit color when direction is credit', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestMoneyTextHostComponent],
    }).createComponent(TestMoneyTextHostComponent);
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spanElement.classList.contains('tabular-nums')).toBe(true);
    expect(spanElement.style.color).toBe('var(--credit)');
    expect(spanElement.textContent?.trim()).toBe('+Rp 150.000,00');
  });

  it('should render debit sign and color when direction is debit', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestMoneyTextHostComponent],
    }).createComponent(TestMoneyTextHostComponent);
    fixture.componentInstance.direction.set('debit');
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spanElement.style.color).toBe('var(--debit)');
    expect(spanElement.textContent?.trim()).toBe('-Rp 150.000,00');
  });

  it('should mask amount when isHidden is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestMoneyTextHostComponent],
    }).createComponent(TestMoneyTextHostComponent);
    fixture.componentInstance.isHidden.set(true);
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(spanElement.textContent?.trim()).toBe('Rp ••••••••');
  });
});
