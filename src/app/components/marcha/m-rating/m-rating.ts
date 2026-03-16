import {
  Component, ChangeDetectionStrategy, input, output, signal, computed, forwardRef, linkedSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type MRatingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'm-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-rating.html',
  styleUrl: './m-rating.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MRating),
    multi: true,
  }],
})
export class MRating implements ControlValueAccessor {
  // ── Inputs ──────────────────────────────────────────────────────
  /** Valor inicial o controlado externamente (sin CVA). Ej: [value]="3" */
  readonly value     = input<number>(0);
  /** Número máximo de estrellas. Por defecto 5. */
  readonly max       = input<number>(5);
  /** Tamaño del componente. */
  readonly size      = input<MRatingSize>('md');
  /** Sólo lectura — muestra el valor sin permitir interacción. */
  readonly readonly  = input<boolean>(false);
  /** Deshabilita la selección. */
  readonly disabled  = input<boolean>(false);
  /** Muestra el valor numérico junto a las estrellas. */
  readonly showValue = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────
  /** Emite el valor seleccionado (compatible con uso standalone, sin CVA). */
  readonly ratingChange = output<number>();

  // ── Internal state ───────────────────────────────────────────────
  /** Valor interno — fuente de verdad. Inicializado desde `value` input y
   *  actualizable tanto por CVA (writeValue) como por interacción del usuario. */
  readonly _value      = linkedSignal(() => this.value());
  readonly _hovered    = signal<number>(0);
  readonly _isDisabled = signal<boolean>(false);

  /** Array [1..max] para el @for del template. */
  readonly _stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1)
  );

  readonly _isInteractive = computed(() =>
    !this.readonly() && !this.disabled() && !this._isDisabled()
  );

  readonly cssClass = computed(() =>
    `m-rating m-rating--${this.size()}` +
    (this.readonly()                          ? ' is-readonly' : '') +
    (this.disabled() || this._isDisabled()    ? ' is-disabled' : '')
  );

  // ── CVA ─────────────────────────────────────────────────────────
  private _onChange:  (v: number) => void = () => {};
  private _onTouched: () => void           = () => {};

  writeValue(v: number | null): void              { this._value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void         { this._onTouched = fn; }
  setDisabledState(d: boolean): void              { this._isDisabled.set(d); }

  // ── Handlers ─────────────────────────────────────────────────────

  onSelect(star: number): void {
    if (!this._isInteractive()) return;
    // Clic en la estrella ya activa → deselecciona (vuelve a 0)
    const newVal = this._value() === star ? 0 : star;
    this._value.set(newVal);
    this._onChange(newVal);
    this._onTouched();
    this.ratingChange.emit(newVal);
  }

  onHover(star: number): void {
    if (!this._isInteractive()) return;
    this._hovered.set(star);
  }

  onLeave(): void {
    this._hovered.set(0);
  }

  /** Devuelve si la estrella debe mostrarse rellena (hover tiene precedencia sobre valor). */
  isFilled(star: number): boolean {
    return star <= (this._hovered() || this._value());
  }
}
