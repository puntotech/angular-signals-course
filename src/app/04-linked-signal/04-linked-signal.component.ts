import { ChangeDetectionStrategy, Component, Signal, WritableSignal, linkedSignal, signal } from '@angular/core';

import { JsonPipe } from '@angular/common';

@Component({
  selector: 'dottech-linked-signal-race-solution',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>point = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Move Concurrently (+1, +1) Twice
    </button>
  `
})
export class LinkedSignalComponent {
   // 1️⃣ Two independent base signals for X and Y
   readonly x: WritableSignal<number> = signal(0);
   readonly y: WritableSignal<number> = signal(0);

   // 2️⃣ linkedSignal (single-computation overload) returns a WritableSignal<{ x, y }>
   readonly point: WritableSignal<{ x: number; y: number }> = linkedSignal(() => ({
     x: this.x(),
     y: this.y()
   }));

   // 3️⃣ Simulate two “clicks” occurring at almost the same time
   moveConcurrently(dx: number, dy: number) {
    const updater = () => this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));
    setTimeout(updater, Math.random() * 1000);
    setTimeout(updater, Math.random() * 1000);

   }

   // 4️⃣ Private helper that uses the linkedSignal API atomically
/*    private move(dx: number, dy: number) {
     // point.update(...) reads {x,y}, applies the function, and writes both back atomically
     this.point.update(({ x, y }) => ({
       x: x + dx,
       y: y + dy
     }));
   } */

   private move(dx: number, dy: number) {
    const updater = () => this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));
    setTimeout(updater, Math.random() * 50);
    setTimeout(updater, Math.random() * 50);
  }

}