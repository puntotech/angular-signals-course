import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';

@Component({
  selector: 'dottech-counter-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Current value of the counter0 {{ count0 }}</h1>
    <h1>Current value of the counter1 {{ count1() }}</h1>
    <h1>Current value of the counter2 {{ count2() }}</h1>

    <button (click)="increment()">Increment</button>
  `,
})
export class SignalsComponent {
  count0: number = 0;
  readonly count1: WritableSignal<number> = signal<number>(0);
  readonly count2: Signal<number> = this.count1.asReadonly();

  increment() {
    console.log(`Updating counter...`);
    this.count0 += 1;
    //this.count1.set(this.count1() + 1);
    this.count1.update((currentValue) => currentValue + 1);

    //this.count2.set(this.count2() + 1); // This will not trigger change detection since count2 is a readonly signal
    //this.count2.update(this.count2() + 1); // This will trigger change detection since count2 is a signal
  }
}
