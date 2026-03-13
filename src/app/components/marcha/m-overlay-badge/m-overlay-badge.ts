import { Component, Input } from '@angular/core';
import { MBadge } from '../m-badge/m-badge';
import type { MBadgeSeverity, MBadgeSize } from '../m-badge/m-badge';

/**
 * m-overlay-badge — Envuelve un elemento y superpone un badge en la esquina superior derecha.
 * Reemplaza p-overlayBadge de PrimeNG.
 *
 * Uso:
 *   <m-overlay-badge value="5" severity="danger">
 *     <m-button icon="lucide:shopping-cart" />
 *   </m-overlay-badge>
 */
@Component({
  selector: 'm-overlay-badge',
  standalone: true,
  imports: [MBadge],
  template: `
    <div class="m-overlay-badge-wrapper">
      <ng-content />
      <m-badge
        [value]="value"
        [severity]="severity"
        [size]="badgeSize"
        class="m-overlay-badge-indicator"
      />
    </div>
  `,
  styleUrl: './m-overlay-badge.css',
})
export class MOverlayBadge {
  @Input() value: string | number = '';
  @Input() severity: MBadgeSeverity = 'danger';
  @Input() badgeSize: MBadgeSize = 'small';
}
