// rxresource-todos.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

interface Post { id: number; title: string; }

@Component({
  selector: 'app-rxresource-todos',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>rxResource Todos Fetch</h2>

    @if (posts.isLoading()) {
      <p>Loading…</p>
    }

    @if (posts.error()) {
      <p>Error: {{ posts.error()?.message }}</p>
    }

    @if (!posts.isLoading() && !posts.error()) {
      <ul>
        @for (p of posts.value(); track p.id) {
          <li>{{ p.title }}</li>
        }
      </ul>
    }

    <button (click)="posts.reload()">Reload</button>
  `
})
export class RxResourceTodosComponent {
  readonly http = inject(HttpClient);

  readonly posts = rxResource<Post[], void>({
    // loader returns an Observable stream
    stream: () => this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts'),
    defaultValue: []
  });
}
