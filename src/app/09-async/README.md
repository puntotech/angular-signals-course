# Angular Async Data Fetching: Classic vs Signals APIs

## 📦 Classic HTTP API with HttpClient

**What is it?**  
The `HttpClient` API from `@angular/common/http` is the traditional way to perform HTTP requests in Angular, based on RxJS and Observables.

### ✅ Advantages
- Full control over request/response handling
- Works well with RxJS operators
- Highly flexible and battle-tested

### ❌ Disadvantages
- Verbose boilerplate (subscriptions, cleanup)
- Manual change detection triggering needed (`markForCheck()`)
- No automatic cancellation or state tracking

### 🧠 Core Concepts
- You must `subscribe()` to start the HTTP request
- Manually update component state on success/error
- OnPush components require `ChangeDetectorRef` to detect changes

### 🧪 Example

```typescript
@Component({
  selector: 'app-classic-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Classic Todos Fetch</h2>
    @if (loading) { <p>Loading...</p> }
    @if (error) { <p>Error: {{ error }}</p> }
    @if (!loading && !error) {
      <ul>
        @for (todo of todos; track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="reload()">Reload</button>
  `
})
export class ClassicTodosComponent implements OnInit, OnDestroy {
  todos: Array<{ id: number; title: string }> = [];
  loading = false;
  error?: string;

  private sub!: Subscription;
  readonly http = inject(HttpClient);
  readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() { this.load(); }

  private load() {
    this.loading = true;
    this.error = undefined;
    this.cdr.markForCheck();

    this.sub = this.http.get<Array<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/posts'
    ).subscribe({
      next: data => {
        this.todos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  reload() {
    this.sub.unsubscribe();
    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
```

---

## 🌊 `resource()` API (Angular Signals)

**What is it?**  
`resource()` is a new API in Angular for reactive async data fetching with automatic cleanup and state tracking. It's signal-aware.

### ✅ Advantages
- Tracks loading, error, and value states out of the box
- Automatically cancels stale requests
- Built for OnPush and Signals-first apps
- Built-in `reload()`

### ❌ Disadvantages
- Not integrated with Angular’s HTTP client by default (uses `fetch()`)
- Manual parsing and error handling

### 🧠 Core Concepts
- Accepts a `params()` signal and a `loader()` function
- Automatically invalidates and re-runs on param signal changes
- Provides `.value()`, `.isLoading()`, `.error()`, `.status()`, and `.reload()`

### 🧪 Example

```typescript
@Component({
  selector: 'app-resource-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Resource Todos Fetch</h2>
    @if(todos.isLoading()) { <p>Loading...</p> }
    @if(todos.error()) { <p>Error: {{ todos.error() }}</p> }
    @if(todos.value()) {
      <ul>
        @for (todo of todos.value(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="todos.reload()">Reload</button>
    <button (click)="reloadWithSignal()">Reload with Signal</button>
    <p>Status: {{ todos.status() }}</p>
    <p>Error: {{ todos.error() | json }}</p>
  `
})
export class ResourceTodosComponent {
  readonly signalToReload = signal(1);

  readonly todos = resource({
    params: () => ({ id: this.signalToReload() }),
    loader: async ({ params, abortSignal }) => {
      console.log(`Loading id ${params.id}`);
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
        signal: abortSignal
      });
      return await res.json();
    }
  });

  reloadWithSignal() {
    this.signalToReload.update(n => n + 1);
  }
}
```

---

## ⚡ `httpResource()` API (Angular + HttpClient)

**What is it?**  
`httpResource()` wraps `HttpClient` for direct integration with Angular’s signal-based change detection. Think of it as `resource()` + `HttpClient`.

### ✅ Advantages
- Cleaner syntax using familiar `HttpClient` under the hood
- Works seamlessly with Signals and OnPush CD
- Automatically handles request status and cancellation
- Built-in `.value()`, `.isLoading()`, `.error()`, `.reload()`, etc.

### ❌ Disadvantages
- Less fine-grained control than classic `HttpClient`
- May feel like a “black box” for debugging complex flows

### 🧠 Core Concepts
- Uses `httpResource(() => config)` with `url`, `method`, `headers`, etc.
- Provides reactive accessors for state and value
- Easy drop-in for reactive Angular apps

### 🧪 Example

```typescript
@Component({
  selector: 'app-http-resource-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>HTTP Resource Todos</h2>
    @if(todos.isLoading()) { <p>Loading...</p> }
    @if(todos.error()) { <p>Error: {{ todos.error() }}</p> }
    @if(todos.value()) {
      <ul>
        @for (todo of todos.value(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="todos.reload()">Reload</button>
    <p>Status: {{ todos.status() }}</p>
    <p>Error: {{ todos.error() | json }}</p>
  `
})
export class HttpResourceTodosComponent {
  readonly todos = httpResource<Array<{ id: number; title: string }>>(
    () => ({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET'
    }),
    {
      defaultValue: []
    }
  );
}
```

---

## 🧾 Summary Table

| Feature                | HttpClient (Classic) | `resource()` | `httpResource()` |
|------------------------|:--------------------:|:------------:|:----------------:|
| Reactive Signals       | ❌ No                | ✅ Yes       | ✅ Yes           |
| Uses HttpClient        | ✅ Yes               | ❌ No (fetch)| ✅ Yes           |
| Auto Abort/Cleanup     | ❌ Manual            | ✅ Yes       | ✅ Yes           |
| Built-in State Mgmt    | ❌ Manual            | ✅ Yes       | ✅ Yes           |
| ChangeDetection Safe   | ❌ markForCheck()    | ✅ Yes       | ✅ Yes           |
| Reload Support         | ❌ Manual            | ✅ reload()  | ✅ reload()      |
| Custom Headers/Config  | ✅ Yes               | ✅ (manual)  | ✅ Easy          |
