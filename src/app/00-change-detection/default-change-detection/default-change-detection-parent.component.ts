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
