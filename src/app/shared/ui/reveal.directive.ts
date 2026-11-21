import {
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  inject,
  input,
} from '@angular/core';

/**
 * Bi-directional viewport reveal animation that toggles `is-visible` on enter/exit
 * without calling `unobserve`, matching the Saku.in replayable motion system.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal-up',
    '[style.--d]': 'delayValue()',
  },
})
export class RevealDirective implements OnInit {
  private readonly elementReference = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyReference = inject(DestroyRef);

  readonly appReveal = input<number | ''>('');

  protected delayValue(): string {
    const rawDelay = this.appReveal();
    if (typeof rawDelay === 'number' && Number.isFinite(rawDelay) && rawDelay >= 0) {
      return `${rawDelay}ms`;
    }
    return '0ms';
  }

  ngOnInit(): void {
    const hostElement = this.elementReference.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      hostElement.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            hostElement.classList.add('is-visible');
          } else {
            hostElement.classList.remove('is-visible');
          }
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(hostElement);
    this.destroyReference.onDestroy(() => observer.disconnect());
  }
}
