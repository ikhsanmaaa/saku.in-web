import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent, ConfirmDialogRow } from './confirm-dialog.component';

@Component({
  imports: [ConfirmDialogComponent],
  template: `
    <app-confirm-dialog
      [isOpen]="isOpen()"
      title="Konfirmasi Transfer"
      subtitle="Periksa detail sebelum dana dikirim."
      [rows]="rows"
      confirmLabel="Kirim Dana"
      (confirmed)="confirmCount.set(confirmCount() + 1)"
      (cancelled)="cancelCount.set(cancelCount() + 1)"
    />
  `,
})
class TestConfirmDialogHostComponent {
  readonly isOpen = signal(true);
  readonly rows: readonly ConfirmDialogRow[] = [
    { label: 'Penerima', value: '@budi' },
    { label: 'Nominal', value: 'Rp 50.000,00', highlight: true },
  ];
  readonly confirmCount = signal(0);
  readonly cancelCount = signal(0);
}

describe('ConfirmDialogComponent', () => {
  it('should render accessible dialog with rows when isOpen is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestConfirmDialogHostComponent],
    }).createComponent(TestConfirmDialogHostComponent);
    fixture.detectChanges();

    const dialogElement = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialogElement).not.toBeNull();
    expect(dialogElement.getAttribute('aria-modal')).toBe('true');
    expect(dialogElement.textContent).toContain('Konfirmasi Transfer');
    expect(dialogElement.textContent).toContain('@budi');
  });

  it('should emit cancelled when Escape key is pressed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestConfirmDialogHostComponent],
    }).createComponent(TestConfirmDialogHostComponent);
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(fixture.componentInstance.cancelCount()).toBe(1);
  });

  it('should emit confirmed when confirm button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestConfirmDialogHostComponent],
    }).createComponent(TestConfirmDialogHostComponent);
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const confirmButton = buttons.find((button) => button.textContent?.includes('Kirim Dana'));
    confirmButton?.click();

    expect(fixture.componentInstance.confirmCount()).toBe(1);
  });

  it('should not render dialog when isOpen is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestConfirmDialogHostComponent],
    }).createComponent(TestConfirmDialogHostComponent);
    fixture.componentInstance.isOpen.set(false);
    fixture.detectChanges();

    const dialogElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialogElement).toBeNull();
  });
});
