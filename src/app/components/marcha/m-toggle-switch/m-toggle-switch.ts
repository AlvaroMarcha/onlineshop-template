import {
  Component, input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MRipple } from '../m-ripple/m-ripple.directive';

export type MToggleSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'm-toggle-switch',
  standalone: true,
  imports: [MRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-toggle-switch.html',
  styleUrl: './m-toggle-switch.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MToggleSwitch),
    multi: true,
  }],
})
export class MToggleSwitch implements ControlValueAccessor {
  readonly label = input('');
  readonly hint  = input('');
  readonly size  = input<MToggleSize>('md');

  readonly checked    = signal(false);
  readonly isDisabled = signal(false);

  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void          = () => {};

  writeValue(v: boolean | null): void     { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void      { this.isDisabled.set(d); }

  onToggle(): void {
    if (this.isDisabled()) return;
    this.checked.update(v => !v);
    this._onChange(this.checked());
    this._onTouched();
  }
}
