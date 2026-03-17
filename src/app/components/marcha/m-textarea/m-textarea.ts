import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'm-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-textarea.html',
  styleUrl: './m-textarea.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MTextarea),
    multi: true,
  }],
})
export class MTextarea implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = ' ';
  @Input() hint = '';
  @Input() rows = 4;
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
    const v = (event.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this._onChange(v);
  }

  onFocus(): void { this.isFocused.set(true); }
  onBlur(): void { this.isFocused.set(false); this._onTouched(); }
}
