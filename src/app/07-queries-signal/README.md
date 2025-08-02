# 👁️ Signal-based View Queries in Angular

Angular now supports **signal-based view queries**, allowing you to reference DOM elements or components using **signals** instead of decorators like `@ViewChild`. This approach improves **reactivity**, simplifies **timing concerns**, and aligns better with `ChangeDetectionStrategy.OnPush`.

---

## 🔎 What Are Signal View Queries?

Signal queries such as `viewChild`, `contentChild`, `viewChildren`, and `contentChildren` are **functions** that return **`Signal<T | null>`** or **`Signal<T[]>`**. They replace Angular's decorator-based queries like `@ViewChild()` and `@ContentChild()`.

| Classic Query (Decorator) | Signal Query (Function) |
|---------------------------|--------------------------|
| `@ViewChild(...)`         | `viewChild(...)`         |
| `@ContentChild(...)`      | `contentChild(...)`      |
| `@ViewChildren(...)`      | `viewChildren(...)`      |
| `@ContentChildren(...)`   | `contentChildren(...)`   |

> 💡 These functions are fully **reactive** and return **signals** that update when the queried elements change.

---

## 🧱 Example 1: Classic `@ViewChild` + `ChangeDetectorRef`

```ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

@Component({
  selector: 'app-no-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Type something…" (input)="readValue()" />
    <p>Value = {{ value }}</p>
  `
})
export class QueriesDecoratorComponent implements AfterViewInit {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  value = '';

  ngAfterViewInit() {
    console.log('📦 Input is ready:', this.inputRef);
  }

  readValue() {
    // ❌ Manual read + manual change detection
    this.value = this.inputRef.nativeElement.value;
    this.cdr.markForCheck(); // Needed with OnPush
  }
}
```

**Drawbacks:**
- Requires `AfterViewInit` to access the element.
- Manual change detection (`markForCheck()`) is needed.
- Doesn't align well with signals or reactive UI updates.

---

## ✅ Example 2: `viewChild()` with Signals

```ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'app-with-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Type something…" (input)="onInput($event)" />
    <p>Value = {{ value() }}</p>
  `
})
export class QueriesSignalsComponent {
  // ✅ viewChild returns a Signal<ElementRef | null>
  readonly inputRef = viewChild('inputRef', { read: ElementRef });

  // ✅ Writable signal to hold the input value
  readonly value = signal('');

  onInput(event: Event): void {
    const inputElement = this.inputRef();
    if (inputElement) {
      this.value.set(inputElement.nativeElement.value);
    }
  }
}
```

**Advantages:**
- No `ngAfterViewInit` needed — `inputRef()` becomes non-null automatically when ready.
- React to DOM changes declaratively.
- Fully compatible with `ChangeDetectionStrategy.OnPush`.
- Aligns with the signal-first Angular direction.

---

## 💡 Summary Table

| Feature                      | `@ViewChild`         | `viewChild()` (Signal)   |
|------------------------------|----------------------|--------------------------|
| Reactivity                   | ❌ Static            | ✅ Reactive `Signal<T>`   |
| Timing needed (`AfterViewInit`)| ✅ Required         | ❌ Not needed            |
| Suitable for Signals         | ❌ Manual sync       | ✅ Fully compatible      |
| Works with OnPush            | ⚠️ Needs `markForCheck()` | ✅ Automatic      |

---

## 🧠 When to Use

Use `viewChild`, `viewChildren`, etc. whenever you're working with signals, OnPush, or reactive apps.

You can still use the decorator style in non-reactive code, but signal queries are more future-proof and cleaner for dynamic UIs.