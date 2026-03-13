import {
  Component, Input, forwardRef, signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** ControlValueAccessor value: [low, high] */
@Component({
  selector: 'm-range-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-range-slider.html',
  styleUrl: './m-range-slider.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MRangeSlider),
    multi: true,
  }],
})
export class MRangeSlider implements ControlValueAccessor {
  @Input() label = '';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() showValues = true;
  @Input() hint = '';

  readonly low = signal(0);
  readonly high = signal(100);
  readonly isDisabled = signal(false);

  readonly fillStyle = computed(() => {
    const range = this.max - this.min;
    const lowPct  = ((this.low()  - this.min) / range) * 100;
    const highPct = ((this.high() - this.min) / range) * 100;
    return `left: ${lowPct}%; width: ${highPct - lowPct}%`;
  });

  private _onChange = (_: [number, number]) => {};
  private _onTouched = () => {};

  writeValue(val: [number, number] | null): void {
    if (Array.isArray(val) && val.length === 2) {
      this.low.set(val[0]);
      this.high.set(val[1]);
    }
  }
  registerOnChange(fn: (_: [number, number]) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  onLowInput(event: Event): void {
    const v = parseFloat((event.target as HTMLInputElement).value);
    const clamped = Math.min(v, this.high() - this.step);
    this.low.set(clamped);
    this.emit();
  }

  onHighInput(event: Event): void {
    const v = parseFloat((event.target as HTMLInputElement).value);
    const clamped = Math.max(v, this.low() + this.step);
    this.high.set(clamped);
    this.emit();
  }

  private emit(): void {
    this._onChange([this.low(), this.high()]);
    this._onTouched();
  }
}
