import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-child', // The selector the parent will use
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child-box">
      <p>Child count = {{ count() }}</p>
      <button (click)="increment()">Increment from Child</button>
    </div>
  `,
  styles: `
      .child-box {
        border: 1px solid #007bff;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
      }
    `,
})
export class ChildComponent {
  // ✅ Replaces 'input' and 'output' with a single 'model()'.
  // 'model.required' indicates the parent MUST provide a value.
  readonly count = model.required<number>();

  constructor() {
    // ✅ The 'effect' still works the same, as 'count' is a Signal.
    effect(() => {
      console.log('🔄 [effect] Child count changed to', this.count());
    });
  }

  increment() {
    // ✅ Instead of emitting an event, the child updates the 'model' directly.
    // This change automatically propagates to the parent.
    this.count.update((v) => v + 1);
  }
}

@Component({
  selector: 'app-root',
  imports: [ChildComponent], // Import the standalone child component
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="parent-box">
      <h2>Parent using model()</h2>
      <button (click)="incrementCount()">+1 from Parent</button>

      <app-child [(count)]="count"></app-child>

      <p class="parent-count">Parent sees count = {{ count() }}</p>
    </div>
  `,
  styles: `
      .parent-box {
        border: 2px solid #333;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: sans-serif;
      }
      .parent-count {
        margin-top: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
      }
      button {
        margin: 0.25rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
      }
    `,
})
export class ModelIOSignalComponent {
  // The parent's Signal remains the source of truth.
  count = signal(0);

  incrementCount() {
    this.count.update((v) => v + 1);
  }

  // ❌ The 'onIncrement()' event handler method is no longer needed and has been removed.
}
