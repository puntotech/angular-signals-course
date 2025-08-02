import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';

@Component({
    selector: 'app-resource-todos',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <h2>Resource Todos Fetch</h2>
      @if(todos.isLoading()) {
        <p>Loading...</p>
      }
      @if(todos.error()) {
        <p>Error: {{ todos.error() }}</p>
      }
      @if(todos.value()) {
        <ul>
          @for (todo of todos.value(); track todo.id) {
            <li>{{ todo.title }}</li>
          }
        </ul>
      }
      <button (click)="todos.reload()">Reload</button>
      <p>Status: {{ todos.status() }}</p>
      <p>Error: {{ todos.error() | json }}</p>
    `
  })
  export class HttpResourceTodosComponent {
    readonly todos = httpResource<Array<{ id: number; title: string }>>(
      () => ({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET'
      }),
      {
        defaultValue: []
      }
    );
  }
