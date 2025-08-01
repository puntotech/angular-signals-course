# Tutorial: Using `computed` Signals in Angular

`computed` signals in Angular allow you to derive state reactively based on other signals. This tutorial explains how to use `computed` signals, based on the `02-counter-computed` example.

---

## 🛠️ What are `computed` Signals?

A `computed` signal is a derived signal whose value depends on other signals. It recalculates its value only when the signals it depends on change, ensuring efficient and lazy updates.

### Key Features

1. **Lazy Evaluation**: Only recalculates when needed.
2. **Memoization**: Avoids unnecessary recalculations by caching the result.
3. **Reactive Updates**: Automatically updates when dependent signals change.

---

## 🔍 Example Overview

In this example, we manage a counter and derive additional state using `computed` signals:

1. A writable signal (`count1`) stores the counter value.
2. A computed signal (`doubleCount`) calculates double the counter value.
3. Another computed signal (`label`) generates a dynamic message based on the counter value.

---

## 📄 Code Breakdown

### Component Code

```typescript
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
  count0: number = 0; // Plain property
  readonly count1: WritableSignal<number> = signal(0); // Writable signal
  readonly count2: Signal<number> = this.count1.asReadonly(); // Readonly signal

  // Computed signal for double the count1 value
  readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);

  // Computed signal for a dynamic label
  readonly label: Signal<string> = computed(() => {
    return this.count1() === 0
      ? 'You haven\'t clicked yet'
      : `You have clicked ${this.count1()} ${this.count1() === 1 ? 'time' : 'times'}!`;
  });

  increment() {
    console.log('Updating counters…');
    this.count0 += 1; // Increment plain property
    this.count1.update(v => v + 1); // Increment writable signal
  }
}
```

---

## 🧠 Key Concepts

### 1️⃣ Writable Signal (`count1`)

- **How it works**: Stores the counter value and can be updated using `.set()` or `.update()`.
- **Usage**: Acts as the source signal for the computed signals.

### 2️⃣ Computed Signal (`doubleCount`)

- **How it works**: Calculates double the value of `count1`.
- **Advantages**: Automatically updates when `count1` changes.

```typescript
readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);
```

### 3️⃣ Computed Signal with Conditional Logic (`label`)

- **How it works**: Generates a dynamic message based on the value of `count1`.
- **Advantages**: Efficiently recalculates only when `count1` changes.

```typescript
readonly label: Signal<string> = computed(() => {
  return this.count1() === 0
    ? 'You haven\'t clicked yet'
    : `You have clicked ${this.count1()} ${this.count1() === 1 ? 'time' : 'times'}!`;
});
```

---

## 🚀 How to Use `computed` Signals

### Step 1: Create a Writable Signal

```typescript
const count1 = signal<number>(0);
```

### Step 2: Define a `computed` Signal

```typescript
const doubleCount = computed(() => count1() * 2);
```

### Step 3: Use the `computed` Signal in the Template

```html
<h1>{{ doubleCount() }}</h1>
```

### Step 4: Update the Source Signal

```typescript
count1.update(value => value + 1);
```

The `computed` signal (`doubleCount`) will automatically update when `count1` changes.

---

## 📝 Summary

| Feature                | Writable Signal (`count1`) | Computed Signal (`doubleCount`, `label`) |
|------------------------|----------------------------|------------------------------------------|
| Reactive Updates       | ✅ Yes                    | ✅ Yes                                   |
| Triggers Change Detection | ✅ Yes                 | ✅ Yes                                   |
| Lazy Evaluation        | ❌ No                     | ✅ Yes                                   |
| Memoization            | ❌ No                     | ✅ Yes                                   |

---

## ✅ Takeaways

- Use **Writable Signals** to store and update state.
- Use **Computed Signals** to derive state reactively and efficiently.
- Computed signals integrate seamlessly with Angular's change detection, making them ideal for dynamic, derived state.

Explore the example in `src/app/02-counter-computed` to see these concepts in action!
