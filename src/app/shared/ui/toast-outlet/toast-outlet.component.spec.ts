import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToastMessage, ToastOutletComponent } from './toast-outlet.component';

@Component({
  imports: [ToastOutletComponent],
  template: `
    <app-toast-outlet [toasts]="toasts()" (dismissed)="dismissedId.set($event)" />
  `,
})
class TestToastOutletHostComponent {
  readonly toasts = signal<readonly ToastMessage[]>([
    { id: 'toast-1', type: 'success', title: 'Berhasil', message: 'Saldo diperbarui.' },
    { id: 'toast-2', type: 'error', title: 'Gagal' },
  ]);
  readonly dismissedId = signal<string | null>(null);
}

describe('ToastOutletComponent', () => {
  it('should render aria-live container and toast alerts when toasts are provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestToastOutletHostComponent],
    }).createComponent(TestToastOutletHostComponent);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('#sp-toast-container') as HTMLElement;
    const alerts = fixture.nativeElement.querySelectorAll('[role="alert"]');

    expect(container.getAttribute('aria-live')).toBe('polite');
    expect(alerts.length).toBe(2);
    expect(alerts[0].textContent).toContain('Berhasil');
    expect(alerts[0].textContent).toContain('Saldo diperbarui.');
  });

  it('should emit toast id when close button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestToastOutletHostComponent],
    }).createComponent(TestToastOutletHostComponent);
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Tutup pesan"]',
    ) as HTMLButtonElement;
    closeButton.click();

    expect(fixture.componentInstance.dismissedId()).toBe('toast-1');
  });
});
