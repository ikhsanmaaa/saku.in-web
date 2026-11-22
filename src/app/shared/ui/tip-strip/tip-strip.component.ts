import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideLightbulb } from '@lucide/angular';

@Component({
  selector: 'app-tip-strip',
  imports: [LucideLightbulb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeTip()) {
      <div class="tip-strip" role="note">
        <span
          class="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-bold tracking-wider uppercase"
          style="color: var(--accent);"
        >
          <svg lucideLightbulb class="h-3.5 w-3.5" aria-hidden="true"></svg>
          {{ badgeLabel() }}
        </span>
        <span class="min-w-0 flex-1 truncate">{{ activeTip() }}</span>
        @if (tips().length > 1) {
          <button
            type="button"
            class="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold"
            style="color: var(--accent);"
            aria-label="Tips berikutnya"
            (click)="showNextTip()"
          >
            Berikutnya
          </button>
        }
      </div>
    }
  `,
})
export class TipStripComponent implements OnInit {
  private readonly destroyReference = inject(DestroyRef);
  private readonly activeIndexSignal = signal(0);

  readonly tips = input<readonly string[]>([]);
  readonly badgeLabel = input<string>('TIPS');
  readonly intervalMilliseconds = input<number>(7000);

  protected readonly activeTip = computed<string | null>(() => {
    const tipList = this.tips();
    if (tipList.length === 0) {
      return null;
    }
    const safeIndex = this.activeIndexSignal() % tipList.length;
    return tipList[safeIndex];
  });

  ngOnInit(): void {
    const intervalDelay = this.intervalMilliseconds();
    if (intervalDelay <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      if (this.tips().length > 1) {
        this.showNextTip();
      }
    }, intervalDelay);

    this.destroyReference.onDestroy(() => clearInterval(timerId));
  }

  protected showNextTip(): void {
    const totalTips = this.tips().length;
    if (totalTips <= 1) {
      return;
    }
    this.activeIndexSignal.update((currentIndex) => (currentIndex + 1) % totalTips);
  }
}
