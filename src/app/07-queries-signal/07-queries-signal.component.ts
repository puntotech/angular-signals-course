import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'app-with-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Type something…" (input)="onInput($event)" />
    <p>Value = {{ value() }}</p>
  `
})
export class QueriesSignalsComponent {
  // ✅ viewChild returns a Signal<ElementRef|null>
  readonly inputRef = viewChild('inputRef', { read: ElementRef });

  // ✅ signal to hold the current input value
  readonly value = signal('');

  onInput(event: Event): void {
    // ✅ Automatically updates when input changes
    const inputElement = this.inputRef();
    if (inputElement) {
      this.value.set(inputElement.nativeElement.value);
    }
  }
}
