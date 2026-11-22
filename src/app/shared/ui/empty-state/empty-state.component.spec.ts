import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      title="Belum ada mutasi"
      description="Transaksi Anda akan tampil di sini."
      [actionLabel]="actionLabel()"
      (actionClicked)="clickCount.set(clickCount() + 1)"
    />
  `,
})
class TestEmptyStateHostComponent {
  readonly actionLabel = signal<string | undefined>('Isi Saldo');
  readonly clickCount = signal(0);
}

describe('EmptyStateComponent', () => {
  it('should render title, description, and emit actionClicked when action button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestEmptyStateHostComponent],
    }).createComponent(TestEmptyStateHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Belum ada mutasi');
    expect(element.textContent).toContain('Transaksi Anda akan tampil di sini.');

    const button = element.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(fixture.componentInstance.clickCount()).toBe(1);
  });
});
