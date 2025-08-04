// app-tick-demo.component.ts
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { outputFromObservable, outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-child-ticker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Child Ticker</h3>
    <p>Child tick = {{ tick }}</p>
  `
})
export class ChildTickerComponent {
  // Emits a value every 2 seconds, exposed as an OutputRef which is also a Signal
  readonly tick = outputFromObservable(interval(2000));
}

@Component({
  selector: 'app-tick-demo',
  standalone: true,
  imports: [CommonModule, ChildTickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>RxJS ↔ Signals Interop Demo</h2>

    <!-- Render the child component and query it as a signal -->
    <app-child-ticker #child></app-child-ticker>

    <!-- Display the tick value received from the child -->
    @if (parentTick() !== undefined) {
      <p>Parent sees tick = {{ parentTick() }}</p>
    }
  `
})
export class TickDemoComponent {
  // Query the child component instance as a Signal
  private childCmp = viewChild.required(ChildTickerComponent);

  // A signal to hold the latest tick value in the parent
  parentTick = signal<number | undefined>(undefined);

  constructor() {
    // Convert the child's tick OutputRef into an Observable,
    // auto-unsubscribe when this component is destroyed,
    // and write each tick into our signal.
    outputToObservable(this.childCmp().tick)
      .pipe(takeUntilDestroyed())
      .subscribe(v => this.parentTick.set(v));
  }
}
