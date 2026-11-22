import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TipStripComponent } from './tip-strip.component';

@Component({
  imports: [TipStripComponent],
  template: `<app-tip-strip [tips]="tips()" [intervalMilliseconds]="0" />`,
})
class TestTipStripHostComponent {
  readonly tips = signal<readonly string[]>([
    'Gunakan username penerima dengan awalan @.',
    'Periksa detail sebelum konfirmasi transfer.',
  ]);
}

describe('TipStripComponent', () => {
  it('should render active tip and advance when next button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestTipStripHostComponent],
    }).createComponent(TestTipStripHostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Gunakan username penerima dengan awalan @.');

    const nextButton = element.querySelector('button') as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(element.textContent).toContain('Periksa detail sebelum konfirmasi transfer.');
  });
});
