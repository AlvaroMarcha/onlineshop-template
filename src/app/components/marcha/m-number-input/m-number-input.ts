import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

@Component({
  selector: 'm-number-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-number-input.html',
  styleUrl: './m-number-input.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MNumberInput),
    multi: true,
  }],
})
export class MNumberInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step = 1;
  @Input() invalid = false;

  readonly value = signal<number>(0);
  readonly isDisabled = signal(false);
  readonly isFocused = signal(false);

  private _onChange = (_: number) => {};
  private _onTouched = () => {};

  writeValue(val: number): void { this.value.set(val ?? 0); }
  registerOnChange(fn: (_: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  get canDecrement(): boolean {
    return this.min === null || this.value() > this.min;
  }
  get canIncrement(): boolean {
    return this.max === null || this.value() < this.max;
  }

  decrement(): void {
    if (this.isDisabled() || !this.canDecrement) return;
    this.emit(this.value() - this.step);
  }

  increment(): void {
    if (this.isDisabled() || !this.canIncrement) return;
    this.emit(this.value() + this.step);
  }

  onInput(event: Event): void {
    const v = parseFloat((event.target as HTMLInputElement).value);
    this.emit(isNaN(v) ? 0 : v);
  }

  private emit(v: number): void {
    this.value.set(v);
    this._onChange(v);
  }

  onFocus(): void { this.isFocused.set(true); }
  onBlur(): void { this.isFocused.set(false); this._onTouched(); }
}
