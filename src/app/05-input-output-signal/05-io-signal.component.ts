import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-child-signals',
  template: `
    <p>Count = {{ count() }}</p>
    <!-- No boilerplate: just call .emit() on the SignalEmitterRef -->
    <button (click)="notify()">Notify Parent</button>
  `
})
export class ChildSignalsComponent {
  // ✅ InputSignal: automatically updates when parent signal changes
  readonly count = input<number>();

  // ✅ SignalEmitterRef: lightweight alternative to EventEmitter
  readonly increment = output<void>();

  constructor() {
    // ✅ Automatic dependency tracking: no ngOnChanges needed
    effect(() => {
      console.log('🔄 [effect] count changed to', this.count());
    });
  }

  notify() {
    // ✅ emit like a signal, integrates with Angular reactivity
    this.increment.emit();
  }
}


@Component({
  selector: 'app-parent-signals',
  imports: [ChildSignalsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Parent using signals</h2>
    <!-- Reactive signal update; UI updates automatically -->
    <button (click)="incrementCount()">+1</button>
    <!-- Pass the signal itself, not a plain value -->
    <app-child-signals
      [count]="count()"
      (increment)="onIncrement()">
    </app-child-signals>
    <p>Parent sees count = {{ count() }}</p>
  `
})
export class ParentSignalsComponent {
  // ✅ WritableSignal: exposes .set() and .update(), reactive by default
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }

  onIncrement() {
    console.log('🔔 [Signal] Child requested increment');
    this.incrementCount();
  }
}
