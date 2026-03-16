import {
  Component, Input, forwardRef, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MRipple } from '../m-ripple/m-ripple.directive';

export interface MRadioOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'm-radio-group',
  standalone: true,
  imports: [MRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-radio-group.html',
  styleUrl: './m-radio-group.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MRadioGroup),
    multi: true,
  }],
})
export class MRadioGroup implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: MRadioOption[] = [];
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() invalid = false;

  readonly value = signal<unknown>(null);
  readonly isDisabled = signal(false);

  private _groupId = `m-radio-${Math.random().toString(36).slice(2, 7)}`;
  get groupName(): string { return this._groupId; }

  private _onChange = (_: unknown) => {};
  private _onTouched = () => {};

  writeValue(val: unknown): void { this.value.set(val); }
  registerOnChange(fn: (_: unknown) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  isSelected(opt: MRadioOption): boolean {
    return this.value() === opt.value;
  }

  select(opt: MRadioOption): void {
    if (this.isDisabled() || opt.disabled) return;
    this.value.set(opt.value);
    this._onChange(opt.value);
    this._onTouched();
  }
}
