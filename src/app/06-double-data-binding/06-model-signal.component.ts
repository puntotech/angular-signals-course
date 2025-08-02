import { Component, model } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [], // FormsModule is not needed here
  template: `
    <input
      [value]="name()"
      (input)="onInput($event)"
      placeholder="Enter your name"
    />
    <p>Hello, {{ name() }}</p>
  `,
})
export class SignalsTwoWayComponent {
  name = model(''); // You need a parent component to provide the model in other case is undefined

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.name.set(input.value);
    }
  }
}
