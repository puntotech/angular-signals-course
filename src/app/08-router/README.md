# 🚦 Angular Router: Classic vs Signals Approach

Angular 17+ introduces **signal-based route inputs**, making routing more reactive, concise, and friendly to `ChangeDetectionStrategy.OnPush`.

This guide compares **classic `ActivatedRoute` routing** with the **new signals-based input binding** using `@input()`.

---

## 🧭 Classic Angular Router with `ActivatedRoute`

```ts
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-classic',
  template: `
    <h2>Classic Router</h2>
    <p>User ID = {{ userId }}</p>
    <button (click)="goNext()">Go to next user</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserClassicComponent implements OnInit, OnDestroy {
  userId!: number;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(this.route.paramMap.subscribe(pm => {
      this.userId = +pm.get('id')!;
      this.cdr.markForCheck(); // 🛠️ Manual signal for re-render
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goNext() {
    this.userId = this.userId + 1;
    this.router.navigateByUrl(`/router-without-signal/user/${this.userId}`);
  }
}
```

**⚠️ Drawbacks:**
- Requires subscription management (boilerplate)
- Manual `markForCheck()` for UI updates with OnPush
- More imperative, less reactive

---

## ✅ Signal-based Routing with `input()`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signals',
  template: `
    <h2>Signals Router</h2>
    <p>User ID = {{ id() }}</p>
    <button (click)="goNext()">Go to next</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSignalsComponent {
  // ✅ Automatically maps route param `id` as a signal
  readonly id = input(0, { transform: numberAttribute });

  private router = inject(Router);

  goNext() {
    this.router.navigateByUrl(`/router-signal/user/${(this.id() ?? 0) + 1}`);
  }
}
```

## ⚙️ Configuring Signal-based Router

To enable signal-based route inputs, update your route configuration to use the `input` property for parameters:

```ts
import { Routes } from '@angular/router';
import { UserSignalsComponent } from './user-signals.component';

export const routes: Routes = [
  {
    path: 'router-signal/user/:id',
    component: UserSignalsComponent,
    // 👇 Enable signal-based input binding for route params
    input: {
      id: 'id' // Maps route param 'id' to component input
    }
  }
];
```

**Note:**  
- The `input` property maps route parameters to component inputs using signals.
- No additional setup is needed in the component—just use `input()` as shown above.
- This feature requires Angular 17+.
## 🛠️ Configuring with `withInputComponentBinding` in `config.ts`

If you prefer a global configuration, Angular Router provides the `withInputComponentBinding` feature. This enables signal-based input binding for all routes by default.

Update your router configuration in `config.ts`:

```ts
import { provideRouter, withInputComponentBinding } from '@angular/router';
import { routes } from './app.routes';

export const routerProviders = [
  provideRouter(routes, withInputComponentBinding())
];
```

**How it works:**
- All route parameters are automatically mapped to component inputs using signals.
- No need to specify the `input` property for each route.
- Components just use `input()` for reactive route params.

**Tip:**  
You can still override or customize input bindings per route if needed.
**💡 Advantages:**
- No manual subscription logic needed
- `id()` is a reactive signal — works seamlessly with OnPush
- Automatically updates when the route param changes
- Supports transformations (e.g., `numberAttribute`) out of the box

---

## 📌 Summary: Routing Patterns

| Feature                    | Classic Router           | Signals-based Router      |
|----------------------------|-------------------------|--------------------------|
| Reactive route param       | ❌ Manual subscription   | ✅ Signal via `@input()`  |
| Auto UI update with OnPush | ❌ Needs `markForCheck`  | ✅ Works naturally        |
| Type coercion / transform  | ❌ Manual                | ✅ With `{ transform }`   |
| Boilerplate                | High                    | Low                      |