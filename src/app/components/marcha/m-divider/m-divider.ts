import { Component, Input } from '@angular/core';

/**
 * m-divider — Separador horizontal o vertical con estilo glass.
 * Uso: <m-divider />  o  <m-divider label="o" />
 */
@Component({
  selector: 'm-divider',
  standalone: true,
  template: `
    <div
      class="m-divider"
      [class.m-divider--vertical]="orientation === 'vertical'"
      [class.m-divider--dashed]="type === 'dashed'"
      [class.m-divider--dotted]="type === 'dotted'"
    >
      @if (label) {
        <span class="m-divider-label">{{ label }}</span>
      }
    </div>
  `,
  styleUrl: './m-divider.css',
})
export class MDivider {
  @Input() label = '';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() type: 'solid' | 'dashed' | 'dotted' = 'solid';
}
