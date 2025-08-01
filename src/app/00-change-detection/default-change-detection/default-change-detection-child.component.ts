import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-child',
  template: `
    <p>Child component: {{ user().name }}</p>
  `,
  // 👇 This is implicit, but added for clarity
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultChangeDetectionComponent {
  user = input.required<{ name: string }>();

  ngOnChanges() {
    console.log('ChildComponent ngOnChanges');
  }

  ngDoCheck() {
    console.log('ChildComponent ngDoCheck');
  }
}