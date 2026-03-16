import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MRipple } from '../m-ripple/m-ripple.directive';

@Component({
  selector: 'm-checkbox',
  standalone: true,
  imports: [MRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-checkbox.html',
  styleUrl: './m-checkbox.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MCheckbox),
    multi: true,
  }],
})
export class MCheckbox implements ControlValueAccessor {
  @Input() label = '';
  @Input() invalid = false;

  readonly checked = signal(false);
  readonly isDisabled = signal(false);

  private _onChange = (_: boolean) => {};
  private _onTouched = () => {};

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (_: boolean) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this._onChange(next);
    this._onTouched();
  }
}
