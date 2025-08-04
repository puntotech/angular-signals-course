// ticker-signals.component.ts
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ticker-signals',
  template: `
    <h2>Signals Ticker</h2>
    <p>Count (Signal) = {{ counter() }}</p>
  `
})
export class TickerSignalsComponent {
  // RxJS Observable emitting 0,1,2… every second
  private counter$ = interval(1000);

  // Convert to a Signal, with an initial value of 0
  readonly counter = toSignal(this.counter$, { initialValue: 0 });
}
