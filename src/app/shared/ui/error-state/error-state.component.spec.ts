import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

@Component({
  imports: [ErrorStateComponent],
  template: `
    <app-error-state
      message="Gagal memuat saldo dompet."
      [showRetry]="showRetry()"
      (retried)="retryCount.set(retryCount() + 1)"
    />
  `,
})
class TestErrorStateHostComponent {
  readonly showRetry = signal(true);
  readonly retryCount = signal(0);
}

describe('ErrorStateComponent', () => {
  it('should render alert role, message, and emit retried when retry button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestErrorStateHostComponent],
    }).createComponent(TestErrorStateHostComponent);
    fixture.detectChanges();

    const alertElement = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(alertElement).not.toBeNull();
    expect(alertElement.textContent).toContain('Gagal memuat saldo dompet.');

    const retryButton = alertElement.querySelector('button') as HTMLButtonElement;
    retryButton.click();
    expect(fixture.componentInstance.retryCount()).toBe(1);
  });

  it('should hide retry button when showRetry is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestErrorStateHostComponent],
    }).createComponent(TestErrorStateHostComponent);
    fixture.componentInstance.showRetry.set(false);
    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('button');
    expect(retryButton).toBeNull();
  });
});
