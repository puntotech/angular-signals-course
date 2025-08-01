# 🔄 Communication Between Components: Decorators vs Signals

Angular enables **component communication** using two main approaches:

- Traditional `@Input()` / `@Output()` decorators
- Modern `input()` / `output()` signal APIs (recommended for signal-based apps)

Below is a comparison of both styles with practical examples.

---

## 🧵 Traditional: `@Input()` + `@Output()` + `EventEmitter`

The classic Angular pattern is imperative and verbose, often requiring lifecycle hooks like `ngOnChanges`.

### Child Component Example

```ts
@Component({
  selector: 'app-child-decorator',
  template: `
    <p>Count = {{ count }}</p>
    <button (click)="notify()">Notify Parent</button>
  `
})
export class ChildDecoratorComponent implements OnChanges {
  @Input() count!: number;
  @Output() increment = new EventEmitter<void>();

  ngOnChanges(ch: SimpleChanges) {
    console.log('🔄 [ngOnChanges] count changed to', this.count);
  }

  notify() {
    this.increment.emit();
  }
}
```

### Parent Component Example

```ts
@Component({
  selector: 'app-parent-decorator',
  imports: [ChildDecoratorComponent],
  template: `
    <h2>Parent using decorators</h2>
    <button (click)="incrementCount()">+1</button>
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
```

**Downsides:**
- Must manually declare `EventEmitter`
- Requires lifecycle hooks (e.g., `ngOnChanges`) to track updates
- Boilerplate-heavy and imperative

---

## ✅ Modern: Signals-Based `input()` and `output()`

Angular’s signals API simplifies input/output binding using reactive primitives.

### Child Component Example

```ts
@Component({
  selector: 'app-child-signals',
  template: `
    <p>Count = {{ count() }}</p>
    <button (click)="notify()">Notify Parent</button>
  `
})
export class ChildSignalsComponent {
  readonly count = input<number>();
  readonly increment = output<void>();

  constructor() {
    effect(() => {
      console.log('🔄 [effect] count changed to', this.count());
    });
  }

  notify() {
    this.increment.emit();
  }
}
```

### Parent Component Example

```ts
@Component({
  selector: 'app-parent-signals',
  imports: [ChildSignalsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Parent using signals</h2>
    <button (click)="incrementCount()">+1</button>
    <app-child-signals
      [count]="count()"
      (increment)="onIncrement()">
    </app-child-signals>
    <p>Parent sees count = {{ count() }}</p>
  `
})
export class ParentSignalsComponent {
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }

  onIncrement() {
    console.log('🔔 [Signal] Child requested increment');
    this.incrementCount();
  }
}
```

**Benefits:**
- `input()` is reactive — no need for `ngOnChanges`
- `output()` is lightweight — no need for `EventEmitter`
- Integrates with signals and `effect()`
- Cleaner and more declarative

---

## ⚖️ Comparison Table

| Feature                    | Decorator API (`@Input` / `@Output`) | Signals API (`input` / `output`) |
|----------------------------|--------------------------------------|----------------------------------|
| Reactive input tracking    | ❌ Manual with `ngOnChanges`          | ✅ Built-in via signals          |
| Output emission            | ❌ Uses `EventEmitter`                | ✅ Uses signal-style `.emit()`   |
| Boilerplate                | ❌ More code                          | ✅ Minimal                      |
| Signals integration        | ❌ Not reactive by default            | ✅ Seamless                     |

---

## 📌 When to Prefer Each

| Use Case                        | Prefer…                   |
|----------------------------------|---------------------------|
| Legacy or hybrid apps            | `@Input()` / `@Output()`  |
| New signal-based apps            | `input()` / `output()`    |
| Precise lifecycle control needed | Decorator API             |
| Concise, reactive communication  | Signal API                |

---

## 🔚 Summary

Angular's signals-based inputs/outputs provide a cleaner, more reactive way to communicate between components, replacing `EventEmitter` and `ngOnChanges` with declarative primitives.

For new signal-based apps, prefer `input()` and `output()` to reduce boilerplate and improve reactivity.