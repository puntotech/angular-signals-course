# 🔗 Tutorial: Using `linkedSignal` in Angular

This tutorial explains how to use **`linkedSignal`** in Angular, and shows **why it's useful for managing consistency in concurrent state updates**. We'll walk through two examples:

- A race condition caused by separate signals
- A solution using `linkedSignal` for atomic updates

---

## 🧠 What is `linkedSignal`?

In Angular, `linkedSignal` creates a **derived writable signal** based on one or more dependencies. It lets you:

- **Read from dependent signals**
- **Write back a consistent update across all of them**, atomically
- Prevent **inconsistent state** in async or concurrent updates

---

## 🐛 Problem: Race Conditions with Independent Signals

Here's a naive approach using two separate `signal()` values for `x` and `y`, and a `computed()` signal for their combination:

### `LinkedSignalRaceComponent`

```ts
@Component({
  selector: 'dottech-linked-signal-race-condition',
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>point = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Move Concurrently (+1, +1) Twice
    </button>
  `
})
export class LinkedSignalRaceComponent {
  readonly x = signal(0);
  readonly y = signal(0);

  readonly point = computed(() => ({ x: this.x(), y: this.y() }));

  moveConcurrently(dx: number, dy: number) {
    this.move(dx, dy);
    this.move(dx, dy);
  }

  private move(dx: number, dy: number) {
    const curX = this.x();
    const curY = this.y();

    setTimeout(() => {
      console.log('Setting x to', curX + dx);
      this.x.set(curX + dx);
    }, Math.random() * 1000);

    setTimeout(() => {
      console.log('Setting y to', curY + dy);
      this.y.set(curY + dy);
    }, Math.random() * 1000);
  }
}
```
## ❌ Problem

If updates to `x` and `y` happen out of order (due to `setTimeout`), the computed `point` may briefly show an inconsistent value.  
This is a classic race condition in UI state.

---

## ✅ Solution: Use `linkedSignal` for Atomic Updates

The fix is to use `linkedSignal()` — which combines reading and writing into a single atomic update.

### `LinkedSignalComponent`

```ts
@Component({
  selector: 'dottech-linked-signal-race-solution',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>point = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Move Concurrently (+1, +1) Twice
    </button>
  `
})
export class LinkedSignalComponent {
  readonly x: WritableSignal<number> = signal(0);
  readonly y: WritableSignal<number> = signal(0);

  readonly point: WritableSignal<{ x: number; y: number }> = linkedSignal(() => ({
    x: this.x(),
    y: this.y()
  }));

  moveConcurrently(dx: number, dy: number) {
    const updater = () =>
      this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));

    setTimeout(updater, Math.random() * 1000);
    setTimeout(updater, Math.random() * 1000);
  }

  // Optional: simpler sync version
  // private move(dx: number, dy: number) {
  //   this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));
  // }
}
```

---

## ✅ Benefits

- `point.update()` reads both `x` and `y` together
- Updates are batched atomically, ensuring consistent state
- No risk of stale reads or inconsistent combinations

---

## ✨ Comparison

| Feature                      | Independent Signals + `computed()` | `linkedSignal()`      |
|------------------------------|:----------------------------------:|:---------------------:|
| Async-safe updates           | ❌ No                              | ✅ Yes                |
| Update consistency           | ❌ Can mismatch                    | ✅ Always in sync     |
| Atomic read/write            | ❌ Split across signals            | ✅ Unified            |
| Writable derived state       | ❌ Not directly                    | ✅ WritableSignal     |

---

## 🧩 When to Use `linkedSignal`

Use `linkedSignal` when:

- You have multiple related signals that need to stay in sync
- You need derived values that can be updated in one step
- You want to avoid race conditions in async environments
- You're building composable state models with minimal bugs


---

## 📝 Summary

`linkedSignal` is the right tool for advanced signal scenarios where atomicity, consistency, and clarity matter.  
It ensures reactive values stay coherent — especially under concurrent or asynchronous updates.
