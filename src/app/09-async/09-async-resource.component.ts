import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

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
      <button (click)="reloadWithSignal()">Reload with Signal</button>
      <p>Status: {{ todos.status() }}</p>
      <p>Error: {{ todos.error() | json }}</p>
    `
  })
  export class ResourceTodosComponent {
    readonly signalToReload = signal(1);
    readonly todos = resource(
     {
      params: () => ({ id: this.signalToReload() }),
      loader: async ({ params, abortSignal }) => {
        console.log(`id ${params.id}, abortSignal: ${abortSignal.aborted}`);
        const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
          signal: abortSignal,
        });
        return await posts.json();
      },
    });

    reloadWithSignal() {
      this.signalToReload.update(n => n + 1);
    }
  }
