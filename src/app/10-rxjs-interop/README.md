# RxJS Interop with Angular Signals

Angular provides utilities to **bridge Signals and RxJS**, enabling smooth interoperability in both directions. This is useful for migrating RxJS-based code or combining Signals with the RxJS ecosystem.

The package [`@angular/core/rxjs-interop`] includes helpers:

- [`toSignal()`](#tosignal): Converts an RxJS `Observable` to a Signal
- [`toObservable()`](#toobservable): Converts a Signal to an RxJS `Observable`
- [`takeUntilDestroyed()`](#takeuntildestroyed): Automatic cleanup for subscriptions
- [`rxResource`](#rxresource): Reactive resource management
- [`outputFromObservable` / `outputToObservable`](#outputfromobservable-and-outputtoobservable): Interop for component outputs

---

## `toSignal()`

**Purpose:** Convert an `Observable` into a Signal for reactive UI updates with automatic change detection.

**Benefits:**
- Use RxJS streams inside Signals-based components
- Simplifies template bindings
- Supports `initialValue` and error handling

**Syntax:**
```ts
toSignal<T>(
  observable$: Observable<T>,
  config: {
    initialValue: T;
    requireSync?: boolean;
    manualCleanup?: boolean;
    injector?: Injector;
    onError?: (err: unknown) => void;
  }
): Signal<T>
```

**Example:**
```ts
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ticker-signals',
  template: `
    <h2>Signals Ticker</h2>
    <p>Count (Signal) = {{ counter() }}</p>
  `
})
export class TickerSignalsComponent {
  private counter$ = interval(1000);
  readonly counter = toSignal(this.counter$, { initialValue: 0 });
}
```
Transforms an RxJS `interval()` Observable into a Signal. The template reacts automatically to updates.

---

## `toObservable()`

**Purpose:** Expose a Signal as an RxJS Observable for use with RxJS operators, libraries, or effects.

**Benefits:**
- Pass Signals into services or effects expecting Observables
- Compose reactive pipelines with RxJS operators

**Syntax:**
```ts
toObservable<T>(source: Signal<T>): Observable<T>
```

**Example:**
```ts
import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-signal-to-rxjs',
  imports: [AsyncPipe],
  template: `
    <h2>Signal → Observable</h2>
    @let v = value$ | async;
    @if(v) {
      <p>Value = {{ v }}</p>
    }
    <button (click)="value.set(value() + 1)">Increment</button>
  `
})
export class SignalToRxJSComponent {
  readonly value = signal(0);
  readonly value$ = toObservable(this.value);
}
```
Lets you use the signal value inside an async pipe.

---

## `takeUntilDestroyed()`: Automatic Cleanup

**Problem:** Forgetting to unsubscribe from Observables can cause memory leaks.

**Solution:** `takeUntilDestroyed()` automatically unsubscribes when the component is destroyed.

**Example:**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-take-until-destroyed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h2>Auto Unsubscribe Ticker</h2>
    <p>Count = {{ counter | async }}</p>
  `
})
export class TakeUntilDestroyedComponent {
  private ticker$ = interval(500);
  readonly counter = this.ticker$.pipe(
    takeUntilDestroyed()
  );
}
```
No need for manual teardown logic or `ngOnDestroy`.

**Comparison:**

| Feature                | Traditional RxJS | With `takeUntilDestroyed()` |
|------------------------|------------------|----------------------------|
| Manual unsubscribe     | Required         | Handled automatically      |
| Needs `ngOnDestroy`    | Yes              | No                         |
| Boilerplate (Subject)  | Yes              | No                         |
| Lifecycle-aware cleanup| Manual           | Built-in                   |

---

## `rxResource`: Reactive Resource Management

**Purpose:** Manage asynchronous resources using RxJS streams and Angular signals.

**Features:**
- Loading status
- Error handling
- Current value
- Automatic state tracking and change detection

**Example:**
```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

interface Post { id: number; title: string; }

@Component({
  selector: 'app-rxresource-todos',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>rxResource Todos Fetch</h2>
    @if (posts.isLoading()) {
      <p>Loading…</p>
    }
    @if (posts.error()) {
      <p>Error: {{ posts.error()?.message }}</p>
    }
    @if (!posts.isLoading() && !posts.error()) {
      <ul>
        @for (p of posts.value(); track p.id) {
          <li>{{ p.title }}</li>
        }
      </ul>
    }
    <button (click)="posts.reload()">Reload</button>
  `
})
export class RxResourceTodosComponent {
  readonly http = inject(HttpClient);
  readonly posts = rxResource<Post[], void>({
    stream: () => this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts'),
    defaultValue: []
  });
}
```
Reactive signals for loading, error, and value states. Reload with `.reload()`.

**Comparison:**

| Feature                  | Classic RxJS | `rxResource`         |
|--------------------------|--------------|----------------------|
| Manual subscription      | Required     | Not required         |
| Loading state management | Manual       | Built-in signal      |
| Error handling           | Manual       | Built-in signal      |
| Change detection         | Manual       | Automatic            |
| Reloading data           | Manual       | Easy `.reload()`     |

---

## `outputFromObservable` and `outputToObservable`: RxJS ↔ Signals Interop

**Purpose:** Bridge RxJS Observables and Angular OutputRefs (signal outputs).

- `outputFromObservable`: Converts an Observable to a signal output
- `outputToObservable`: Converts a signal output back to an Observable

**Example:**
```ts
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { outputFromObservable, outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-child-ticker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Child Ticker</h3>
    <p>Child tick = {{ tick }}</p>
  `
})
export class ChildTickerComponent {
  readonly tick = outputFromObservable(interval(2000));
}

@Component({
  selector: 'app-tick-demo',
  standalone: true,
  imports: [CommonModule, ChildTickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>RxJS ↔ Signals Interop Demo</h2>
    <app-child-ticker #child></app-child-ticker>
    @if (parentTick() !== undefined) {
      <p>Parent sees tick = {{ parentTick() }}</p>
    }
  `
})
export class TickDemoComponent {
  private childCmp = viewChild.required(ChildTickerComponent);
  parentTick = signal<number | undefined>(undefined);

  constructor() {
    outputToObservable(this.childCmp().tick)
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.parentTick.set(value));
  }
}
```
Child exposes a ticking signal output; parent consumes it as an Observable and updates a local signal.

---

## Summary

Angular’s RxJS interop utilities enable seamless migration and hybrid use of Signals and RxJS:

- Use `toSignal()` and `toObservable()` for conversion
- Use `takeUntilDestroyed()` for automatic cleanup
- Use `rxResource` for reactive resource management
- Use `outputFromObservable` and `outputToObservable` for component output interop

These tools help you progressively migrate to Signals or interconnect with RxJS-based APIs in libraries, services, or existing applications.
