# 🧠 Understanding Change Detection in Angular

Angular’s **Change Detection (CD)** keeps your UI in sync with your data. This guide explains the basics and compares three approaches:

1. **Default Change Detection**: Checks all components on any change.
2. **OnPush Change Detection**: Checks only when inputs change by reference.
3. **Signals with Change Detection**: Enables fine-grained, reactive updates.

---

## ⚙️ What is Change Detection?

Change Detection is how Angular decides when to update the DOM. It walks the component tree and updates bindings as needed, based on the component’s `ChangeDetectionStrategy`.

---

## 1️⃣ Default Change Detection

- Angular checks every component whenever:
  - Events occur (clicks, inputs)
  - Observables emit
  - Async tasks finish (`setTimeout`, `Promise.resolve`, etc.)
- All components are checked, even if their inputs haven’t changed.

**Example:**

```ts
@Component({
  selector: 'app-child',
  template: `{{ user().name }}`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChangeDetectionDefaultComponent {
  user = input.required<{ name: string }>();
}
```

```ts
@Component({
  selector: 'app-parent',
  imports: [ChangeDetectionDefaultComponent],
  template: `
    <button (click)="mutateUser()">Mutate user.name</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  user = { name: 'Carlos' };

  mutateUser() {
    this.user.name = 'Updated Carlos';
  }
}
```

- View updates even if the object reference stays the same.

---

## 2️⃣ OnPush Change Detection

- Angular skips components unless:
  - A new reference is passed to an `input()`
  - You manually trigger change detection

**Example:**

```ts
@Component({
  selector: 'app-child',
  template: `<p>Child: {{ user().name }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  user = input.required<{ name: string }>();
}
```

```ts
@Component({
  selector: 'app-parent',
  template: `
    <button (click)="mutateUser()">Mutate user.name</button>
    <button (click)="replaceUser()">Replace user object</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  user = { name: 'Carlos' };

  mutateUser() {
    this.user.name = 'Updated Carlos';
  }

  replaceUser() {
    this.user = { ...this.user, name: 'Replaced Carlos' };
  }
}
```

- Mutating a property won’t update the view (same reference).
- Replacing the object will update the view (new reference).

---

## 3️⃣ Signals + OnPush

Signals provide reactive state and trigger updates automatically, even with OnPush.

**Example:**

```ts
@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Child: {{ user().name }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  user = input.required<Signal<{ name: string }>>();
}
```

```ts
@Component({
  selector: 'app-parent',
  template: `
    <button (click)="mutate()">Mutate signal</button>
    <button (click)="replace()">Replace signal</button>
    <app-child [user]="userSignal"></app-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  userSignal = signal({ name: 'Carlos' });

  mutate() {
    this.userSignal.update(user => ({ ...user, name: 'Updated Carlos' }));
  }

  replace() {
    this.userSignal.set({ name: 'Replaced Carlos' });
  }
}
```

- Both mutate and replace trigger updates.
- No need for manual change detection.

---

## 4️⃣ Signals for Inputs + Local State

Combine input signals and local signals for full reactivity.

**Example:**

```ts
@Component({
  selector: 'app-parent',
  template: `
    <button (click)="changeUser()">Change user</button>
    <app-child [user]="userSignal"></app-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  userSignal = signal({ name: 'Carlos' });

  changeUser() {
    this.userSignal.set({ name: 'New ' + Math.random().toFixed(2) });
  }
}
```

```ts
@Component({
  selector: 'app-child',
  imports: [CommonModule],
  template: `
    <div>
      <p>User: {{ user().name }}</p>
      <p>Counter: {{ counter() }}</p>
      <button (click)="increment()">+1</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  user = input.required<Signal<{ name: string }>>();
  counter = signal(0);

  increment() {
    this.counter.update(c => c + 1);
  }
}
```

- Changing the input signal updates the view.
- Local state updates reactively.

---

## Summary Table

| Action                | Default Strategy | OnPush Only | OnPush + Signals |
|-----------------------|:----------------:|:-----------:|:----------------:|
| Mutate object field   | ✅ Updates       | ❌ No       | ✅ Yes           |
| Replace object        | ✅ Updates       | ✅ Yes      | ✅ Yes           |
| Local signal update   | n/a              | ❌ No       | ✅ Yes           |
| Manual markForCheck() | ❌ Not needed    | ✅ Sometimes| ❌ Not needed    |

**Takeaways:**

- Default checks everything—easy but inefficient.
- OnPush is faster but needs new references.
- Signals make OnPush efficient and reactive.
- Signals simplify state management.

Use signals when you want fine-grained reactivity, use OnPush, and want to avoid manual change detection.

## Examples

### 🧪 Example 1: ChangeDetectionStrategy.Default
We’ll create:

- A parent component with a button to trigger a change.
- A child component that receives an @Input() object.

#### Step 1: Child component

```ts
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-child',
  template: `
    <p>Child component: {{ user().name }}</p>
  `,
  // 👇 This is implicit, but added for clarity
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultChangeDetectionComponent {
  user = input.required<{ name: string }>();

  ngOnChanges() {
    console.log('ChildComponent ngOnChanges');
  }

  ngDoCheck() {
    console.log('ChildComponent ngDoCheck');
  }
}
```

#### Step 2: Parent component
```ts
import { Component } from "@angular/core";
import { DefaultChangeDetectionComponent } from "./default-change-detection-child.component";

@Component({
  selector: 'app-parent',
  imports: [DefaultChangeDetectionComponent],
  template: `
    <button (click)="changeSomething()">Change something (no effect on input)</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  user = { name: 'Carlos' };

  changeSomething() {
    console.log('Button clicked');
    // Changing something unrelated
    const x = Math.random();
  }
}
```

*What happens?*

Even though user doesn’t change, clicking the button triggers a full CD cycle, including:

- `ngDoCheck()` on `ChildComponent`
- Re-evaluation of `{{ user.name }}` in the template

This is Angular’s default: check everything, just in case.

### 🧪 Example 2: ChangeDetectionStrategy.Default – Direct Mutation Example

Update the ParentComponent:
```ts
import { Component } from "@angular/core";
import { DefaultChangeDetectionComponent } from "./default-change-detection-child.component";

@Component({
  selector: 'app-parent',
  imports: [DefaultChangeDetectionComponent],
  template: `
    <button (click)="mutateUser()">Mutate user.name</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  user = { name: 'Carlos' };

  mutateUser() {
    this.user.name = 'Updated Carlos';
    console.log('Mutated user.name');
  }
}
```

*What happens?*
The mutation is in-place, so the reference stays the same.

But Angular still re-renders the child, because in Default mode, it checks every component's bindings regardless of reference identity.

You’ll see:

```bash
Mutated user.name
ChildComponent ngDoCheck
```

### 🔁 Example 3: ChangeDetectionStrategy.OnPush

#### Step 1: Modify the child:
```ts
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-child',
  template: `
    <p>Child component: {{ user().name }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  user = input.required<{ name: string }>();

  ngOnChanges() {
    console.log('ChildComponent ngOnChanges');
  }

  ngDoCheck() {
    console.log('ChildComponent ngDoCheck');
  }
}
```
#### Step 2: Use the same parent:
```ts
import { ChildComponent } from "./onpush-change-detection-child.component";
import { Component } from "@angular/core";

@Component({
  selector: 'app-parent',
  imports: [ChildComponent],
   template: `
    <button (click)="mutateUser()">Mutate user.name</button>
    <button (click)="replaceUser()">Replace user object</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  user = { name: 'Carlos' };

  mutateUser() {
    this.user.name = 'Updated Carlos';
    console.log('Mutated user.name');
  }

  replaceUser() {
    this.user = { ...this.user, name: 'Replaced Carlos' };
    console.log('Replaced user object');
  }
}
```

*❌ What happens when clicking Mutate `user.name`?*

- No change in the view.
- No `ngOnChanges` logs but `ngDoCheck` logs is shown.

Because reference didn’t change, Angular ignores the update.

*✅ What happens when clicking Replace `user` object?*

- The view updates.
- `ngOnChanges` fires.

Because the reference did change, Angular re-checks.

#### Summary
| Action               | Default Mode | OnPush Mode | View Updates? |
|----------------------|:------------:|:-----------:|:-------------:|
| Mutate `user.name`   | ✅ Yes       | ❌ No       | Differs       |
| Replace user object  | ✅ Yes       | ✅ Yes      | ✅ Always     |


### ⚡ Example 3: Signals + ChangeDetectionStrategy.OnPush + local state

We’ll simulate:

- A parent sending a user object (as a signal) to a child.
- The child also having local state: like a counter.
- All with OnPush, fully reactive, no manual CD.

*💡 Why is this powerful?*

- No need to worry about reference equality.
- No need to clone objects manually.
- No need for manual CD triggers.

Signals make `OnPush` practical and efficient.

`Parent component`

```ts
@Component({
  selector: 'app-parent',
  template: `
    <button (click)="changeUser()">Change user</button>
    <app-child [user]="userSignal"></app-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  userSignal = signal({ name: 'Carlos' });

  changeUser() {
    this.userSignal.set({ name: 'New Name ' + Math.random().toFixed(2) });
  }
}
```

`Child component (with input + local state)`

```ts
@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p>User name from input: {{ user().name }}</p>
      <p>Local counter: {{ counter() }}</p>
      <button (click)="increment()">Increment local counter</button>
    </div>
  `
})
export class ChildComponent {
  @Input() user!: Signal<{ name: string }>;

  // 🔄 Local component state managed by signal
  counter = signal(0);

  increment() {
    this.counter.update(count => count + 1);
  }

  ngDoCheck() {
    console.log('ChildComponent CD cycle');
  }
}
```

*🔎 What happens?*

- Pressing Change user:
  - Triggers re-render of the child.
  - Updates the name shown via user().name.
  
- Pressing Increment local counter:
  - Updates only the counter() signal.
  - Still works even under OnPush.

No extra object cloning, no manual triggers, and full reactivity inside and outside the component.

*Summary* 
  
| What changed            | Renders child? | Updates view? |
|------------------------|:--------------:|:-------------:|
| `userSignal.set(...)`  | ✅ Yes         | ✅ Yes        |
| `counter.update(...)`  | ✅ Yes         | ✅ Yes        |

Because both values are signals, they handle Change Detection automatically, even in OnPush.