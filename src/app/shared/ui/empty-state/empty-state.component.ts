import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';

@Component({
  selector: 'app-empty-state',
  imports: [ZardEmptyComponent, ZardButtonComponent],
  viewProviders: [provideIcons({ lucideInbox })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-empty
      class="sp-surface rounded-2xl border px-6 py-10"
      zIcon="lucideInbox"
      [zTitle]="title()"
      [zDescription]="description() ?? ''"
      [zActions]="actionLabel() ? [actionTemplate] : []"
    />
    <ng-template #actionTemplate>
      @if (actionLabel()) {
        <button
          z-button
          zType="outline"
          type="button"
          class="sp-btn-secondary mt-2 rounded-xl px-4 py-2 text-xs"
          (click)="actionClicked.emit()"
        >
          {{ actionLabel() }}
        </button>
      }
    </ng-template>
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly actionClicked = output<void>();
}
