import { Component, Input } from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MAvatarSize = 'small' | 'normal' | 'large' | 'xlarge';
export type MAvatarShape = 'circle' | 'square';

/**
 * m-avatar — Avatar con soporte de imagen, icono o iniciales.
 * Uso:
 *   <m-avatar image="url.jpg" size="large" />
 *   <m-avatar label="Juan García" />  ← muestra "JG"
 *   <m-avatar icon="lucide:user" severity="primary" />
 */
@Component({
  selector: 'm-avatar',
  standalone: true,
  imports: [MIcon],
  templateUrl: './m-avatar.html',
  styleUrl: './m-avatar.css',
})
export class MAvatar {
  @Input() image = '';
  /** Nombre completo — se extraen las iniciales */
  @Input() label = '';
  /** Icono Iconify cuando no hay imagen ni label */
  @Input() icon = '';
  @Input() size: MAvatarSize = 'normal';
  @Input() shape: MAvatarShape = 'circle';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'warn' | 'danger' | 'info' = 'secondary';

  get initials(): string {
    if (!this.label) return '';
    const parts = this.label.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  get iconSize(): string {
    const map: Record<MAvatarSize, string> = { small: '14', normal: '18', large: '22', xlarge: '28' };
    return map[this.size];
  }

  get computedClass(): string {
    return [
      'm-avatar',
      `m-avatar--${this.size}`,
      `m-avatar--${this.shape}`,
      this.image ? '' : `m-avatar--${this.severity}`,
    ].filter(Boolean).join(' ');
  }
}
