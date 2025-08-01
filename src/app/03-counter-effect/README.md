# Tutorial: Using `effect` in Angular

`effect` in Angular allows you to perform side effects reactively whenever a signal changes. This tutorial explains how to use `effect`, based on the `03-counter-effect` example.

---

## 🛠️ What is `effect`?

An `effect` is a reactive mechanism in Angular that runs a function whenever the signals it depends on change. It is useful for performing side effects like logging, updating the DOM, or interacting with external systems.

### Key Features

1. **Reactive Execution**: Automatically runs when dependent signals change.
2. **Immediate Execution**: Runs once immediately upon creation.
3. **Cleanup Support**: Allows you to define cleanup logic for external subscriptions or resources.

---

## 🔍 Example Overview

In this example, we manage a counter using a writable signal (`count`) and log its changes using an `effect`. Additionally, the `effect` updates the document title whenever the counter changes.

---

## 📄 Code Breakdown

### Component Code

```typescript
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
    (document as Document).title = `Count is ${current}`;
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
```

---

## 🧠 Key Concepts

### 1️⃣ Writable Signal (`count`)

- **How it works**: Stores the counter value and can be updated using `.set()` or `.update()`.
- **Usage**: Acts as the source signal for the `effect`.

```typescript
readonly count: WritableSignal<number> = signal(0);
```

### 2️⃣ Effect (`logAndTitleEffect`)

- **How it works**: Runs a function whenever the `count` signal changes.
- **Side Effects**:
  - Logs the current value of `count` to the console.
  - Updates the document title to reflect the current value of `count`.

```typescript
private readonly logAndTitleEffect = effect(() => {
  const current = this.count();
  console.log(`🟢 [Effect] count changed to ${current}`);
  (document as Document).title = `Count is ${current}`;
});
```

---

## 🚀 How to Use `effect`

### Step 1: Create a Writable Signal

```typescript
const count = signal<number>(0);
```

### Step 2: Define an `effect`

```typescript
const logEffect = effect(() => {
  console.log(`Count is now ${count()}`);
});
```

### Step 3: Trigger the `effect` by Updating the Signal

```typescript
count.update(value => value + 1);
```

The `effect` will automatically run whenever `count` changes.

---

## 📝 Summary

| Feature                | Writable Signal (`count`) | Effect (`logAndTitleEffect`) |
|------------------------|---------------------------|------------------------------|
| Reactive Updates       | ✅ Yes                   | ✅ Yes                      |
| Triggers Change Detection | ✅ Yes                | n/a                         |
| Performs Side Effects  | ❌ No                    | ✅ Yes                      |
| Cleanup Support        | n/a                      | ✅ Yes                      |

---

## ✅ Takeaways

- Use **Writable Signals** to store and update state.
- Use **Effects** to perform side effects reactively whenever signals change.
- Effects integrate seamlessly with Angular's change detection, making them ideal for logging, DOM updates, or external interactions.

Explore the example in `src/app/03-counter-effect` to see these concepts in action!
