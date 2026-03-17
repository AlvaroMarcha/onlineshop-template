import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';
import { MRipple } from '../m-ripple/m-ripple.directive';

export type MInputType = 'text' | 'email' | 'tel' | 'url' | 'search';
export type MInputSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'm-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MRipple],
  templateUrl: './m-input.html',
  styleUrl: './m-input.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MInput),
    multi: true,
  }],
})
export class MInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = ' ';
  @Input() hint = '';
  @Input() icon = '';
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() type: MInputType = 'text';
  @Input() size: MInputSize = 'medium';
  @Input() invalid = false;

  readonly value = signal('');
  readonly isDisabled = signal(false);
  readonly isFocused = signal(false);

  private _onChange = (_: string) => {};
  private _onTouched = () => {};

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: (_: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this._onChange(v);
  }

  onFocus(): void { this.isFocused.set(true); }
  onBlur(): void { this.isFocused.set(false); this._onTouched(); }
}
