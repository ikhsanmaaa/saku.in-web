import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [RevealDirective],
  template: `<div [appReveal]="140" data-testid="revealed">Content</div>`,
})
class TestRevealHostComponent {}

describe('RevealDirective', () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('should toggle is-visible class without calling unobserve when intersecting changes', () => {
    let observerCallback: IntersectionObserverCallback | undefined;
    const observeSpy = vi.fn();
    const unobserveSpy = vi.fn();
    const disconnectSpy = vi.fn();

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly scrollMargin = '';
      readonly thresholds = [0.08];

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = disconnectSpy;
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    globalThis.IntersectionObserver = MockIntersectionObserver;

    const fixture = TestBed.configureTestingModule({
      imports: [TestRevealHostComponent],
    }).createComponent(TestRevealHostComponent);
    fixture.detectChanges();

    const targetElement = fixture.nativeElement.querySelector(
      '[data-testid="revealed"]',
    ) as HTMLElement;

    expect(targetElement.classList.contains('reveal-up')).toBe(true);
    expect(targetElement.style.getPropertyValue('--d')).toBe('140ms');
    expect(observeSpy).toHaveBeenCalledWith(targetElement);

    observerCallback?.(
      [{ isIntersecting: true, target: targetElement } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(targetElement.classList.contains('is-visible')).toBe(true);
    expect(unobserveSpy).not.toHaveBeenCalled();

    observerCallback?.(
      [{ isIntersecting: false, target: targetElement } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(targetElement.classList.contains('is-visible')).toBe(false);
    expect(unobserveSpy).not.toHaveBeenCalled();

    fixture.destroy();
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('should add is-visible immediately when IntersectionObserver is unavailable', () => {
    // Simulate SSR or unsupported environment
    (globalThis as Record<string, unknown>)['IntersectionObserver'] = undefined;

    const fixture = TestBed.configureTestingModule({
      imports: [TestRevealHostComponent],
    }).createComponent(TestRevealHostComponent);
    fixture.detectChanges();

    const targetElement = fixture.nativeElement.querySelector(
      '[data-testid="revealed"]',
    ) as HTMLElement;

    expect(targetElement.classList.contains('is-visible')).toBe(true);
  });
});
