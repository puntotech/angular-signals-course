import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classic-two-way',
  imports: [FormsModule],
  template: `
    <h2>Classic [(ngModel)] Binding</h2>
    <!-- Requires FormsModule and ngModel directive -->
    <input [(ngModel)]="name" placeholder="Enter your name">
    <p>Hello, {{ name }}!</p>
  `
})
export class ClassicTwoWayComponent {
  // Plain property bound via ngModel
  name: string = '';
}
