import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MButtonSeverity =
  | 'primary' | 'secondary' | 'success'
  | 'warn' | 'danger' | 'info' | 'help' | 'contrast';
export type MButtonVariant = 'filled' | 'outlined' | 'text';
export type MButtonSize = 'small' | 'large' | null;

/**
 * m-button — Botón con soporte completo de variantes,
 * severidades, estados y accesibilidad.
 *
 * API compatible con p-button de PrimeNG:
 *   <m-button label="Click" severity="primary" variant="filled" />
 *   <m-button label="Delete" severity="danger" variant="outlined" (onClick)="..." />
 *   <m-button icon="lucide:home" [rounded]="true" />
 */
@Component({
  selector: 'm-button',
  standalone: true,
  imports: [MIcon],
  templateUrl: './m-button.html',
  styleUrl: './m-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MButton {
  @Input() label = '';
  /** Icono Iconify. Ej: 'lucide:save', 'ph:trash' */
  @Input() icon = '';
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() severity: MButtonSeverity = 'primary';
  @Input() variant: MButtonVariant = 'filled';
  @Input() size: MButtonSize = null;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() rounded = false;
  @Input() full = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() styleClass = '';
  /** Alias PrimeNG: link → variant = 'text' */
  @Input() link = false;
  /** Alias PrimeNG: outlined → variant = 'outlined' */
  @Input() outlined = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  get resolvedVariant(): MButtonVariant {
    if (this.link) return 'text';
    if (this.outlined) return 'outlined';
    return this.variant;
  }

  get iconSize(): string {
    if (this.size === 'small') return '14';
    if (this.size === 'large') return '20';
    return '16';
  }

  get computedClass(): string {
    const cls = [
      'm-btn',
      `m-btn--${this.severity}`,
      `m-btn--${this.resolvedVariant}`,
    ];
    if (this.size) cls.push(`m-btn--${this.size}`);
    if (this.rounded) cls.push('m-btn--rounded');
    if (this.full) cls.push('m-btn--full');
    if (this.disabled || this.loading) cls.push('m-btn--disabled');
    if (this.icon && !this.label) cls.push('m-btn--icon-only');
    if (this.styleClass) cls.push(this.styleClass);
    return cls.join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
