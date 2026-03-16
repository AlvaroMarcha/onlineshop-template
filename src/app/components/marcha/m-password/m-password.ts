import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

export type MPasswordSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'm-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-password.html',
  styleUrl: './m-password.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MPassword),
    multi: true,
  }],
})
export class MPassword implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() size: MPasswordSize = 'medium';
  @Input() invalid = false;

  readonly value = signal('');
  readonly isDisabled = signal(false);
  readonly isFocused = signal(false);
  readonly showPassword = signal(false);

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
  toggleVisibility(): void { this.showPassword.update(v => !v); }
}
