import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: ` <p>Child component: {{ user().name }}</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildComponent {
  user = input.required<{ name: string }>();

  ngOnChanges() {
    console.log('ChildComponent ngOnChanges');
  }

  ngDoCheck() {
    console.log('ChildComponent ngDoCheck');
  }
}
