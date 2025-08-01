import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, effect, signal } from '@angular/core';

import { JsonPipe } from '@angular/common';

@Component({
  selector: 'dottech-linked-signal-race-condition',
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <h1>point = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Move Concurrently (+1, +1) Twice
    </button>
  `
})
export class LinkedSignalRaceComponent {
  // Two independent writable signals
  readonly x = signal(0);
  readonly y = signal(0);

  // Computed signal combines x and y into a point object
  readonly point = computed(() => ({ x: this.x(), y: this.y() }));


  // Simulates two concurrent movements (+1,+1) where each one updates x and y separately.
  moveConcurrently(dx: number, dy: number) {
    this.move(dx, dy);
    this.move(dx, dy);
  }

  private move(dx: number, dy: number) {
    // 1) capture the current values
    const curX = this.x();
    const curY = this.y();

    // 2) schedule the two writes at random future times
    setTimeout(() => {
      console.log('Setting x to', curX + dx);
      this.x.set(curX + dx);
    }, Math.random() * 1000);

    setTimeout(() => {
      console.log('Setting y to', curY + dy);
      this.y.set(curY + dy);
    }, Math.random() * 1000);
  }
}
