import { ActivatedRoute, Router } from '@angular/router';
// user-classic.component.ts
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-classic',
  template: `<h2>Classic Router</h2>
    <p>User ID = {{ userId }}</p>
    <button (click)="goNext()">Go to next user</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserClassicComponent implements OnInit, OnDestroy {
  userId!: number;
  isNavigating = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(this.route.paramMap.subscribe(pm => {
      this.userId = +pm.get('id')!;
      this.cdr.markForCheck();
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goNext() {
    this.userId = this.userId + 1;
    this.router.navigateByUrl(`/router-without-signal/user/${this.userId}`);
  }
}
