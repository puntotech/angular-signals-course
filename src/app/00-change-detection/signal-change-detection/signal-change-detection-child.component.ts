import { ChangeDetectionStrategy, Component, Input, Signal, input, signal } from "@angular/core";

@Component({
  selector: 'app-child',
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
  user = input.required<{ name: string }>();

  // 🔄 Local component state managed by signal
  counter = signal(0);

  increment() {
    this.counter.update(count => count + 1);
  }

  ngDoCheck() {
    console.log('ChildComponent CD cycle');
  }
}