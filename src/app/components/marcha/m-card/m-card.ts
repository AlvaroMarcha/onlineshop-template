import { Component, Input } from '@angular/core';

export type MCardVariant = 'glass' | 'solid' | 'flat';

/**
 * m-card — Contenedor glassmorphism con soporte de header/footer por proyección.
 *
 * Uso con string inputs:
 *   <m-card header="Título" subHeader="Subtítulo">Contenido</m-card>
 *
 * Uso con slots de contenido:
 *   <m-card>
 *     <div mCardHeader>Header personalizado</div>
 *     Contenido principal
 *     <div mCardFooter>Footer</div>
 *   </m-card>
 */
@Component({
  selector: 'm-card',
  standalone: true,
  imports: [],
  templateUrl: './m-card.html',
  styleUrl: './m-card.css',
})
export class MCard {
  @Input() header = '';
  @Input() subHeader = '';
  @Input() variant: MCardVariant = 'glass';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() styleClass = '';

  get computedClass(): string {
    return [
      'm-card',
      `m-card--${this.variant}`,
      `m-card--pad-${this.padding}`,
      this.styleClass,
    ].filter(Boolean).join(' ');
  }
}
