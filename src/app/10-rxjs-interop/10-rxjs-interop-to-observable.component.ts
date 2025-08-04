import { AsyncPipe } from '@angular/common';
// signal-to-rxjs.component.ts
import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signal-to-rxjs',
  imports: [AsyncPipe],
  template: `
    <h2>Signal → Observable</h2>
    @let v = value$ | async;
    @if(v) {
      <p>Value = {{ v }}</p>
    }
    <button (click)="value.set(value() + 1)">Increment</button>
  `
})
export class SignalToRxJSComponent {
  readonly value = signal(0);

  // Expose the signal as an RxJS Observable
  readonly value$ = toObservable(this.value);
}
