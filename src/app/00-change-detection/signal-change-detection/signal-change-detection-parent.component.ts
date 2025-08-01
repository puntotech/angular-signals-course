import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { ChildComponent } from "./signal-change-detection-child.component";

@Component({
  selector: 'app-parent',
  imports: [ChildComponent],
  template: `
    <button (click)="changeUser()">Change user</button>
    <app-child [user]="userSignal()"></app-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  userSignal = signal({ name: 'Carlos' });

  changeUser() {
    this.userSignal.set({ name: 'New Name ' + Math.random().toFixed(2) });
  }
}