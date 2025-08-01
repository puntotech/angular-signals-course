import { ChangeDetectionStrategy, Component, Signal, WritableSignal, effect, signal } from '@angular/core';

@Component({
  selector: 'dottech-counter-effect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>count (writable signal) = {{ count() }}</h1>
    <button (click)="increment()">Increment</button>
  `
})
export class CounterEffectComponent {
  // 1️⃣ WritableSignal: holds our counter value
  readonly count: WritableSignal<number> = signal(0);

  // 2️⃣ Effect: runs on subscription and whenever `count` changes
  private readonly logAndTitleEffect = effect(() => {
    const current = this.count();
    // Side-effect #1: log to console
    console.log(`🟢 [Effect] count changed to ${current}`);
    // Side-effect #2: update document title
    //typeof document !== 'undefined' && (document as Document).title = `Count is ${current}`;
    (document as Document).title = `Count is ${current}`;

    // You could return a cleanup function here if you, for example,
    // set up an external subscription that needs tearing down:
    // return () => unsubscribeFromSomething();
  });

  constructor() {
    // Effects run immediately once on creation:
    // logs "count changed to 0" and sets title to "Count is 0"
  }

  increment() {
    // Update the writable signal; triggers the effect automatically
    this.count.update(currentValue => currentValue + 1);
  }
}
