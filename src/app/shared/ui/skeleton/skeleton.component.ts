import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-skeleton',
  imports: [ZardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-hidden="true" class="flex flex-col gap-2">
      @for (lineIndex of lineIndices(); track lineIndex) {
        <z-skeleton [class]="shapeClass()" />
      }
    </div>
  `,
})
export class SkeletonComponent {
  readonly variant = input<'text' | 'card' | 'circle'>('text');
  readonly lines = input<number>(1);
  readonly widthClass = input<string>('w-full');
  readonly heightClass = input<string>('h-4');

  protected readonly lineIndices = computed<readonly number[]>(() => {
    const count = Math.max(1, this.lines());
    return Array.from({ length: count }, (_unused, index) => index);
  });

  protected readonly shapeClass = computed<string>(() => {
    const radiusClass =
      this.variant() === 'circle'
        ? 'rounded-full'
        : this.variant() === 'card'
          ? 'rounded-2xl'
          : 'rounded-lg';
    return `${this.widthClass()} ${this.heightClass()} ${radiusClass}`;
  });
}
