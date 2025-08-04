import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

// take-until-destroyed.component.ts
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-take-until-destroyed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    <h2>Auto Unsubscribe Ticker</h2>
    <p>Count = {{ counter | async }}</p>
  `
})
export class TakeUntilDestroyedComponent {
  // interval as Observable
  private ticker$ = interval(500);

  readonly counter = this.ticker$.pipe(takeUntilDestroyed())
}
