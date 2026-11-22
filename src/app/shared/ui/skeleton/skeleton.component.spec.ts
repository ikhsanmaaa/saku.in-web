import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

@Component({
  imports: [SkeletonComponent],
  template: `<app-skeleton [lines]="lines()" variant="card" heightClass="h-24" />`,
})
class TestSkeletonHostComponent {
  readonly lines = signal(3);
}

describe('SkeletonComponent', () => {
  it('should render requested number of aria-hidden skeleton blocks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestSkeletonHostComponent],
    }).createComponent(TestSkeletonHostComponent);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLElement;
    const blocks = wrapper.querySelectorAll('[data-slot="skeleton"]');

    expect(wrapper).not.toBeNull();
    expect(blocks.length).toBe(3);
    expect(blocks[0].classList.contains('rounded-2xl')).toBe(true);
  });
});
