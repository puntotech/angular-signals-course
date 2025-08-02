import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

@Component({
  selector: 'app-no-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Type something…" (input)="readValue()" />
    <p>Value = {{ value }}</p>
  `
})
export class QueriesDecoratorComponent implements AfterViewInit {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  cdr : ChangeDetectorRef = inject(ChangeDetectorRef);
  value = '';

  ngAfterViewInit() {
    // ❌ Must wait for view init before inputRef is ready
    console.log('Input element is ready:', this.inputRef);
  }

  readValue() {
    // ❌ Manual read + manual change‑detection
    this.value = this.inputRef.nativeElement.value;
    this.cdr.markForCheck();
  }
}
