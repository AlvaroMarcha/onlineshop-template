import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

export interface MSelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'm-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-select.html',
  styleUrl: './m-select.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MSelect),
    multi: true,
  }],
})
export class MSelect implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() hint = '';
  @Input() options: MSelectOption[] = [];
  @Input() invalid = false;

  readonly selectedIndex = signal<number>(-1);
  readonly isDisabled = signal(false);
  readonly isFocused = signal(false);

  private _onChange = (_: unknown) => {};
  private _onTouched = () => {};

  get selectedLabel(): string {
    const opt = this.options[this.selectedIndex()];
    return opt ? opt.label : '';
  }

  writeValue(val: unknown): void {
    const idx = this.options.findIndex(o => o.value === val);
    this.selectedIndex.set(idx);
  }
  registerOnChange(fn: (_: unknown) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  onChange(event: Event): void {
    const idx = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedIndex.set(idx);
    this._onChange(this.options[idx]?.value ?? null);
  }

  onFocus(): void { this.isFocused.set(true); }
  onBlur(): void { this.isFocused.set(false); this._onTouched(); }
}
