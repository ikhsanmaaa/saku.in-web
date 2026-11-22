import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [status]="status()" [label]="label()" />`,
})
class TestStatusBadgeHostComponent {
  readonly status = signal('ACTIVE');
  readonly label = signal<string | undefined>(undefined);
}

describe('StatusBadgeComponent', () => {
  it('should render normalized status label and credit styling when status is ACTIVE', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestStatusBadgeHostComponent],
    }).createComponent(TestStatusBadgeHostComponent);
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('z-badge') as HTMLElement;
    expect(badgeElement.textContent?.trim()).toBe('ACTIVE');
    expect(badgeElement.style.color).toBe('var(--credit)');
  });

  it('should render debit styling when status is BLOCKED or FAIL', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestStatusBadgeHostComponent],
    }).createComponent(TestStatusBadgeHostComponent);
    fixture.componentInstance.status.set('BLOCKED');
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('z-badge') as HTMLElement;
    expect(badgeElement.textContent?.trim()).toBe('BLOCKED');
    expect(badgeElement.style.color).toBe('var(--debit)');
  });

  it('should display custom label when label input is provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestStatusBadgeHostComponent],
    }).createComponent(TestStatusBadgeHostComponent);
    fixture.componentInstance.status.set('REVERSED');
    fixture.componentInstance.label.set('Direversal');
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('z-badge') as HTMLElement;
    expect(badgeElement.textContent?.trim()).toBe('Direversal');
  });
});
