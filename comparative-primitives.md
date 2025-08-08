# Introduction to Angular Signal Primitives and Async Resources

Angular's reactivity system is built around a set of powerful primitives that allow developers to manage state and side effects with fine-grained control and efficiency. These primitives vary in terms of their reactivity granularity, mutability, execution timing, and typical use cases. Some are foundational and stable parts of Angular’s core reactive model since version 16, while others are experimental or upcoming features designed to extend capabilities, particularly around nested state and asynchronous operations.

Understanding the differences between these primitives helps in choosing the right tool for modeling state, derived data, reactive effects, or integrating with asynchronous data sources like HTTP requests or Observables.

Below is a concise overview of each primitive and resource, followed by a detailed comparative table.

---

### Brief explanations of the primitives and APIs

- **signal()**  
  The fundamental reactive primitive representing a piece of state. It holds a value that can be read and mutated. Changes to the signal notify all dependents immediately.

- **computed()**  
  A read-only derived value that automatically recalculates whenever any of its dependent signals change. It helps model values computed from other reactive data without manual updates.

- **effect()**  
  Runs imperative reactive logic whenever its dependencies change. Effects are ideal for performing side effects like updating the DOM or logging when reactive data updates.

- **linkedSignal()**  
  A flexible primitive that lets you define custom getter and setter logic while preserving reactive tracking. Useful for complex or computed state that needs controlled mutation behavior.

- **toSignal()**  
  Converts external reactive sources such as RxJS Observables or Promises into Angular signals, bridging Angular's reactive system with other reactive libraries or APIs.

- **afterRenderEffect()**  
  Similar to `effect()`, but defers execution until after Angular has completed rendering and updating the DOM. This is useful when reactive logic depends on the updated DOM state.

- **projectedSignal()**  
  Provides reactive access and mutation to a single top-level property of an object signal. Enables granular reactivity focused on specific object properties. Currently experimental.

- **deepSignal()**
  Extends reactivity deeper into nested object properties, tracking changes at any nested level within an object. Enables fine-grained updates without replacing the whole object. Experimental.

- **structuralSignal()**  
  Tracks changes on the entire object reference, ignoring internal mutations. Useful when identity changes matter more than deep mutations. Experimental.

- **asReadonly()**  
  Wraps an existing signal to provide a read-only interface, preventing external mutation but allowing reactive reads.

- **resource** (experimental)  
  A reactive primitive designed for managing asynchronous logic that depends on signals. Returns a reactive variable that updates as async operations complete, with automatic cancellation and tracking.

- **httpResource** (experimental)  
  A specialized version of `resource` that wraps Angular’s HttpClient to perform reactive HTTP requests with caching and cancellation support.

---

# Comparative Table of Angular Signal Primitives and Resources

| API / Primitive         | Reactivity Granularity          | Mutable?      | Execution Phase / Trigger          | Origin / What it Does                                | When It Runs / Notifies                            | Dependency Tracking Type                               | Minimum Compatibility (Status)          |
|------------------------|--------------------------------|--------------|----------------------------------|-----------------------------------------------------|---------------------------------------------------|-------------------------------------------------------|-----------------------------------------|
| **signal()**           | Global (whole value)            | ✅ Yes       | Immediate reactive                | Base state                                          | On `set()` / `update()`                            | Automatic tracking on read                            | Core (Angular 16+)                      |
| **computed()**         | Derived (automatic dependencies)| ❌ No        | Immediate reactive                | Derived value                                      | When dependencies change                          | Automatic tracking inside `computed`                  | Core (Angular 16+)                      |
| **effect()**           | Based on dependencies           | N/A          | Immediate reactive                | Imperative reactive logic                          | Every time dependencies change                   | Automatic dependency tracking                         | Core (Angular 16+)                      |
| **afterRenderEffect()**| Based on read dependencies      | N/A          | **Post-render (DOM ready)**      | Effect that waits for DOM update                    | After DOM render / flush                          | Automatic dependency tracking; post-render execution | Core (Angular 19+)                      |
| **linkedSignal()**     | Composed / customized           | ✅ Yes       | Immediate reactive                | Signal with custom getter/setter                   | On read/write                                    | Automatic read tracking; customized write behavior    | Core (Angular 19+, stabilized in v20) |
| **toSignal()**         | Varies based on source          | — (read-only)| Immediate reactive                | Converts Observables, Promises, etc. to Signals   | When synchronized source changes                 | Tracking from external source                         | Core (Angular 19+, stabilized in v20) |
| **projectedSignal()*** | First-level property            | ✅ Yes       | Immediate reactive                | Manipulates specific property of a parent object   | When that property changes                        | Tracking limited to the specific key                   | In PR (deep-signal-magic) — not stable yet |
| **deepSignal()***      | Nested object property          | ✅ Yes       | Immediate reactive                | Manipulates nested property                         | When nested property changes                      | Tracking on the specific path                         | In PR (deep-signal-magic) — not stable yet |
| **structuralSignal()***| Whole object (reference)        | ❌ No direct | Immediate reactive                | View of whole object, ignores fine-grained changes | Only if object reference changes                  | Full reference tracking                               | In PR (deep-signal-magic) — not stable yet |
| **asReadonly()**       | Same as source signal           | ❌ No        | Same as source                   | Read-only signal                                   | Same as original signal                           | Automatic tracking; prevents external writes         | Core (Angular 16+)                      |


# Comparative Table of Angular Resource Primitives 

| API / Primitive         | Reactivity Granularity          | Mutable?      | Execution Phase / Trigger          | Origin / What it Does                                | When It Runs / Notifies                            | Dependency Tracking Type                               | Minimum Compatibility (Status)          |
|------------------------|--------------------------------|--------------|----------------------------------|-----------------------------------------------------|---------------------------------------------------|-------------------------------------------------------|-----------------------------------------|
| **resource** (experimental)      | Variable (resource value)          | —            | Reactive (signal dependent)      | Executes async logic based on signals              | When `params()` of resource changes               | Tracking from source signal                           | Experimental (Angular 20)               |
| **httpResource** (experimental)  | Variable (httpResource)             | —            | Reactive (signal dependent)      | Wrapper over HttpClient for reactive requests      | When source signal changes                        | Tracking of signal + HTTP                            | Experimental (Angular 20)               |

