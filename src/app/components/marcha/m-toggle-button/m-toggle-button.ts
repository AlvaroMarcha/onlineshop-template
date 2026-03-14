import {
  Component, input, forwardRef, signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

export type MToggleButtonSize     = 'sm' | 'md' | 'lg';
export type MToggleButtonSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger';

@Component({
  selector: 'm-toggle-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-toggle-button.html',
  styleUrl: './m-toggle-button.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MToggleButton),
    multi: true,
  }],
})
export class MToggleButton implements ControlValueAccessor {
  readonly label    = input('');
  readonly icon     = input('');
  readonly size     = input<MToggleButtonSize>('md');
  readonly severity = input<MToggleButtonSeverity>('primary');

  readonly active     = signal(false);
  readonly isDisabled = signal(false);

  readonly cssClass = computed(() =>
    `m-toggle-btn size-${this.size()} sev-${this.severity()}` +
    (this.active()     ? ' is-active'   : '') +
    (this.isDisabled() ? ' is-disabled' : '')
  );

  private _onChange:  (v: boolean) => void = () => {};
  private _onTouched: () => void           = () => {};

  writeValue(v: boolean | null): void              { this.active.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void          { this._onTouched = fn; }
  setDisabledState(d: boolean): void               { this.isDisabled.set(d); }

  onToggle(): void {
    if (this.isDisabled()) return;
    this.active.update(v => !v);
    this._onChange(this.active());
    this._onTouched();
  }
}
