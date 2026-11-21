import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Minimal shell placeholder; full navigation and drawer are implemented in v0.1-T7. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-black text-white">
      <main id="sp-page-main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {}
