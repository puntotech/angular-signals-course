// classic-todos.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classic-todos',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Classic Todos Fetch</h2>
    @if (loading) {
      <p>Loading...</p>
    }
    @if (error) {
      <p>Error: {{ error }}</p>
    }
    @if (!loading && !error) {
      <ul>
        @for (todo of todos; track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="reload()">Reload</button>
  `
})
export class ClassicTodosComponent implements OnInit, OnDestroy {
  todos: Array<{ id: number; title: string }> = [];
  loading = false;
  error?: string;
  private sub!: Subscription;
  readonly http = inject(HttpClient);
  readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.load();
  }
  private load() {
    this.loading = true;
    this.error = undefined;
    this.cdr.markForCheck();

    this.sub = this.http.get<Array<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/posts'
    ).subscribe({
      next: data => {
        this.todos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  reload() {
    this.sub.unsubscribe();
    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
