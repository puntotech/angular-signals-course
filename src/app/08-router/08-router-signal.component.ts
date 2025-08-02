// user-signals.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signals',
  template: `
    <h2>Signals Router</h2>
    <p>User ID = {{ id() }}</p>
    <button (click)="goNext()">Go to next</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSignalsComponent {
  // ✅ Route parameter "id" bound as a signal
  readonly id = input(0, { transform: numberAttribute });

  private router = inject(Router);

  goNext() {
    this.router.navigateByUrl(`/router-signal/user/${+(this.id() ?? 0) + 1}`);

  }
}


