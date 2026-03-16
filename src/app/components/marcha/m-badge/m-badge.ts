import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type MBadgeSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger' | 'info';
export type MBadgeSize = 'small' | 'normal' | 'large';

/**
 * m-badge — Etiqueta/pill de estado o contador.
 * Uso: <m-badge value="3" severity="danger" />
 *       <m-badge value="Nuevo" severity="success" />
 *       <m-badge [dot]="true" severity="danger" />  ← solo punto
 */
@Component({
  selector: 'm-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './m-badge.html',
  styleUrl: './m-badge.css',
})
export class MBadge {
  @Input() value: string | number = '';
  @Input() severity: MBadgeSeverity = 'primary';
  @Input() size: MBadgeSize = 'normal';
  @Input() dot = false;

  get computedClass(): string {
    return [
      'm-badge',
      `m-badge--${this.severity}`,
      `m-badge--${this.size}`,
      this.dot ? 'm-badge--dot' : '',
    ].filter(Boolean).join(' ');
  }
}
