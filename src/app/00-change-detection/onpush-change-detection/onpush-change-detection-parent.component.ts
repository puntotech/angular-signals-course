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