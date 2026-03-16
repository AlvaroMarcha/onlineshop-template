import {
  Component, input, forwardRef, signal, computed,
  ChangeDetectionStrategy, HostListener, ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

// ── Color math utilities ──────────────────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if      (h < 60)  { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  if (clean.length === 3) {
    // expand shorthand e.g. #rgb → #rrggbb
    const expanded = clean.split('').map(c => c + c).join('');
    return hexToRgb('#' + expanded);
  }
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return match
    ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
    : null;
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d   = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

// ── Component ─────────────────────────────────────────────────────────────────

const DEFAULT_SWATCHES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#f8fafc', '#1e293b',
];

@Component({
  selector: 'm-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-color-picker.html',
  styleUrl: './m-color-picker.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MColorPicker),
    multi: true,
  }],
})
export class MColorPicker implements ControlValueAccessor {
  readonly label    = input('');
  readonly inline   = input(false);
  readonly swatches = input<string[]>(DEFAULT_SWATCHES);
  readonly hint     = input('');

  // Internal HSV state
  readonly hue = signal(217);   // 0–360
  readonly sat = signal(78);    // 0–100
  readonly bri = signal(96);    // 0–100  (brightness/value)

  readonly isOpen     = signal(false);
  readonly isDisabled = signal(false);
  readonly hexInput   = signal('#3b82f6');

  // Element refs stored on pointerdown for accurate getBoundingClientRect()
  private _svEl: HTMLElement | null   = null;
  private _hueEl: HTMLElement | null  = null;
  private _isDraggingSV  = false;
  private _isDraggingHue = false;

  // ── Computed ───────────────────────────────────────────────────────────────

  readonly hexColor = computed(() => {
    const [r, g, b] = hsvToRgb(this.hue(), this.sat(), this.bri());
    return rgbToHex(r, g, b);
  });

  /** Pure hue color used as the base of the SV gradient */
  readonly hueBg = computed(() => `hsl(${this.hue()}, 100%, 50%)`);

  /** Thumb position inside the SV area */
  readonly thumbLeft = computed(() => `${this.sat()}%`);
  readonly thumbTop  = computed(() => `${100 - this.bri()}%`);

  /** Hue thumb position */
  readonly hueThumbLeft = computed(() => `${(this.hue() / 360) * 100}%`);

  // ── ControlValueAccessor ──────────────────────────────────────────────────

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(val: string | null): void {
    if (!val) return;
    const rgb = hexToRgb(val);
    if (rgb) {
      const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      this.hue.set(h);
      this.sat.set(s);
      this.bri.set(v);
      this.hexInput.set(rgbToHex(rgb[0], rgb[1], rgb[2]));
    }
  }

  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void         { this._onTouched = fn; }
  setDisabledState(d: boolean): void              { this.isDisabled.set(d); }

  // ── Click outside to close ────────────────────────────────────────────────

  constructor(private readonly _host: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!this._host.nativeElement.contains(e.target as Node)) {
      this.isOpen.set(false);
    }
  }

  // ── Trigger ───────────────────────────────────────────────────────────────

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update(v => !v);
    this._onTouched();
  }

  // ── SV area drag ──────────────────────────────────────────────────────────

  onSVPointerDown(e: PointerEvent): void {
    if (this.isDisabled()) return;
    e.preventDefault();
    this._isDraggingSV = true;
    this._svEl = e.currentTarget as HTMLElement;
    this._svEl.setPointerCapture(e.pointerId);
    this._updateSV(e);
  }

  onSVPointerMove(e: PointerEvent): void {
    if (!this._isDraggingSV || !this._svEl) return;
    this._updateSV(e);
  }

  onSVPointerUp(): void { this._isDraggingSV = false; }

  private _updateSV(e: PointerEvent): void {
    const rect = this._svEl!.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top,  rect.height));
    this.sat.set(Math.round((x / rect.width)  * 100));
    this.bri.set(Math.round((1 - y / rect.height) * 100));
    this._emit();
  }

  // ── Hue slider drag ───────────────────────────────────────────────────────

  onHuePointerDown(e: PointerEvent): void {
    if (this.isDisabled()) return;
    e.preventDefault();
    this._isDraggingHue = true;
    this._hueEl = e.currentTarget as HTMLElement;
    this._hueEl.setPointerCapture(e.pointerId);
    this._updateHue(e);
  }

  onHuePointerMove(e: PointerEvent): void {
    if (!this._isDraggingHue || !this._hueEl) return;
    this._updateHue(e);
  }

  onHuePointerUp(): void { this._isDraggingHue = false; }

  private _updateHue(e: PointerEvent): void {
    const rect = this._hueEl!.getBoundingClientRect();
    const x    = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    this.hue.set(Math.round((x / rect.width) * 360));
    this._emit();
  }

  // ── Hex input ─────────────────────────────────────────────────────────────

  onHexInputChange(e: Event): void {
    this.hexInput.set((e.target as HTMLInputElement).value);
  }

  applyHexInput(): void {
    const raw = this.hexInput().trim();
    const hex = raw.startsWith('#') ? raw : '#' + raw;
    const rgb = hexToRgb(hex);
    if (rgb) {
      const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      this.hue.set(h);
      this.sat.set(s);
      this.bri.set(v);
      this.hexInput.set(rgbToHex(rgb[0], rgb[1], rgb[2]));
      this._emit();
    } else {
      // reset to valid color
      this.hexInput.set(this.hexColor());
    }
  }

  onHexKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.applyHexInput();
  }

  // ── Swatches ──────────────────────────────────────────────────────────────

  pickSwatch(color: string): void {
    this.writeValue(color);
    this._emit();
  }

  isActiveSwatch(color: string): boolean {
    // Normalize swatch through the same HSV round-trip to avoid precision mismatches
    const rgb = hexToRgb(color);
    if (!rgb) return false;
    const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    const [r2, g2, b2] = hsvToRgb(h, s, v);
    return rgbToHex(r2, g2, b2).toLowerCase() === this.hexColor().toLowerCase();
  }

  // ── Internal emit ─────────────────────────────────────────────────────────

  private _emit(): void {
    this.hexInput.set(this.hexColor());
    this._onChange(this.hexColor());
  }
}
