# 🔁 Two-Way Data Binding in Angular: Classic vs Signals

Angular supports multiple forms of two-way data binding. Signals introduce a **reactive and declarative** way to bind values both **from parent to child** and **from user input to model**.

---

## ✅ 1. Classic `[(ngModel)]` (FormsModule)

The traditional approach uses `FormsModule` and the `ngModel` directive:

### 🔧 `ClassicTwoWayComponent`

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classic-two-way',
  imports: [FormsModule],
  template: `
    <h2>Classic [(ngModel)] Binding</h2>
    <input [(ngModel)]="name" placeholder="Enter your name">
    <p>Hello, {{ name }}!</p>
  `
})
export class ClassicTwoWayComponent {
  name: string = '';
}
```

**Notes:**
- ✅ Easy and declarative
- ❌ Requires FormsModule
- ❌ Not reactive with Angular signals
- ❌ Doesn't work well with `ChangeDetectionStrategy.OnPush`

---

## 🆕 2. Signals: Manual Two-Way Binding

Use a `model()` signal and manually connect the DOM event (`input`) to `set()`.

### 🔧 `SignalsTwoWayComponent`

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <input [value]="name()" (input)="onInput($event)" placeholder="Enter your name">
    <p>Hello, {{ name() }}</p>
  `
})
export class SignalsTwoWayComponent {
  name = model('');

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.name.set(input.value);
    }
  }
}
```

**Notes:**
- ✅ Fully reactive
- ✅ No FormsModule required
- ❌ Slightly more boilerplate (manual input handler)
- ✅ Works perfectly with OnPush

---

## 💡 3. Signals: Component-Level Two-Way Binding with `model()` + `[(...)]`

Replace both `input()` and `output()` with a single `model()` binding, and use `[(count)]` in the parent.

### 🧱 `ChildComponent` (with `model.required()`)

```typescript
import { Component, ChangeDetectionStrategy, effect, model } from '@angular/core';

@Component({
  selector: 'app-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child-box">
      <p>Child count = {{ count() }}</p>
      <button (click)="increment()">Increment from Child</button>
    </div>
  `
})
export class ChildComponent {
  readonly count = model.required<number>();

  constructor() {
    effect(() => {
      console.log('🔄 [effect] Child count changed to', this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
  }
}
```

### 🧱 `ParentComponent` using `[(count)]`

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-root',
  imports: [ChildComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="parent-box">
      <h2>Parent using model()</h2>
      <button (click)="incrementCount()">+1 from Parent</button>
      <app-child [(count)]="count"></app-child>
      <p>Parent sees count = {{ count() }}</p>
    </div>
  `
})
export class ModelIOSignalComponent {
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }
}
```

**Notes:**
- ✅ Super clean two-way binding via `[(count)]`
- ✅ No `input`, `output`, or `EventEmitter`
- ✅ No `ngOnChanges` or manual sync logic
- ✅ Fully reactive and OnPush-compatible

---

## 🧠 Summary: Which Should You Use?

| Use Case                        | Recommended Approach                |
|----------------------------------|-------------------------------------|
| Legacy app with FormsModule      | `[(ngModel)]`                       |
| Reactive app with signals        | `model()` + `[(...)]`               |
| Simple forms without boilerplate | Manual signals + `set()`            |
| Parent-child coordination        | `model.required()` + `[(...)]`      |

---

## 📌 Final Tip

- ✅ Use `model()` when both parent and child need to sync on the same signal.
- ✅ For user input, signals let you fully eliminate FormsModule and gain finer control.