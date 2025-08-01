import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child-decorator',
  template: `
    <p>Count = {{ count }}</p>
    <!-- Imperative event emitter -->
    <button (click)="notify()">Notify Parent</button>
  `
})
export class ChildDecoratorComponent implements OnChanges {
  // ❌ Plain number input: no built‑in reactivity, relies on ngOnChanges
  @Input() count!: number;

  // ❌ Extra boilerplate: must declare an EventEmitter for output
  @Output() increment = new EventEmitter<void>();

  ngOnChanges(ch: SimpleChanges) {
    // ❌ Lifecycle hook needed just to detect updates
    console.log('🔄 [ngOnChanges] count changed to', this.count);
  }

  notify() {
    // ❌ Manual emit call
    this.increment.emit();
  }
}

@Component({
  selector: 'app-parent-decorator',
  imports: [ChildDecoratorComponent],
  template: `
    <h2>Parent using decorators</h2>
    <!-- Manual state mutation; no reactive tracking -->
    <button (click)="incrementCount()">+1</button>
    <!-- Must bind both a value and an event emitter -->
    <app-child-decorator
      [count]="count"
      (increment)="onIncrement()">
    </app-child-decorator>
  `
})
export class ParentDecoratorComponent {
  count = 0;

  incrementCount() {
    this.count++;
  }

  onIncrement() {
    console.log('🔔 Child requested increment');
    this.count++;
  }
}


