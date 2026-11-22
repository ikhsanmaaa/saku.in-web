import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

@Component({
  imports: [PageHeaderComponent],
  template: `
    <app-page-header
      title="Dompet Utama"
      subtitle="Snapshot saldo buku besar"
      badge="DOMPET UTAMA"
    >
      <button type="button">Aksi</button>
    </app-page-header>
  `,
})
class TestPageHeaderHostComponent {}

describe('PageHeaderComponent', () => {
  it('should render title, subtitle, badge, and projected actions', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestPageHeaderHostComponent],
    }).createComponent(TestPageHeaderHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Dompet Utama');
    expect(element.textContent).toContain('Snapshot saldo buku besar');
    expect(element.textContent).toContain('DOMPET UTAMA');
    expect(element.querySelector('button')?.textContent?.trim()).toBe('Aksi');
  });
});
