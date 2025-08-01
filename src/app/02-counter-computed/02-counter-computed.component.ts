import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, signal } from '@angular/core';

@Component({
  selector: 'dottech-counter-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>count0 (plain property) = {{ count0 }}</h1>
    <h1>count1 (writable signal) = {{ count1() }}</h1>
    <h1>count2 (readonly signal) = {{ count2() }}</h1>
    <h1>doubleCount (computed) = {{ doubleCount() }}</h1>
    <h1>label (computed) = {{ label() }}</h1>

    <button (click)="increment()">Increment</button>
  `
})
export class CounterComputedComponent {
  // 1️⃣ Plain component property
  count0: number = 0;

  // 2️⃣ WritableSignal: can use .set() and .update()
  readonly count1: WritableSignal<number> = signal(0);

  // 3️⃣ Readonly Signal: cannot be modified directly
  readonly count2: Signal<number> = this.count1.asReadonly();

  // 4️⃣ Computed signal that derives double the count1 value
  readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);

  // 5️⃣ Computed signal with conditional text based on count1
  readonly label: Signal<string> = computed(() => {
    // Lazy and efficient: only recalculates when count1 changes
    // count1() is only evaluated when needed and use () to access its value
    // count1() use memoization to avoid unnecessary recalculations
    // This is a lazy evaluation: it only runs when the value is needed
    // and it caches the result until count1 changes.
    return this.count1() === 0
      ? 'You haven\'t clicked yet'
      : `You have clicked ${this.count1()} ${this.count1() === 1 ? 'time' : 'times'}!`;
  });

  increment() {
    console.log('Updating counters…');

    // Increment plain property
    this.count0 += 1;

    // Update writable signal using .set()
    //this.count1.set(this.count1() + 1);

    // Update writable signal using .update() for atomic increment
    this.count1.update(v => v + 1);

    // count2 is readonly: the following would be errors
    // this.count2.set(...)    // ❌ Not allowed
    // this.count2.update(...) // ❌ Not allowed

    // Computed signals (doubleCount, label) update automatically
  }
}
