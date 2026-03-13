import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Wrapper que flota la etiqueta cuando el input hijo tiene foco o valor.
 * Uso: <m-float-label label="Email"><input class="m-field-el" placeholder=" " /></m-float-label>
 * IMPORTANTE: el input hijo debe tener placeholder=" " (espacio) para que :placeholder-shown funcione.
 */
@Component({
  selector: 'm-float-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-float-label.html',
  styleUrl: './m-float-label.css',
})
export class MFloatLabel {
  @Input() label = '';
}
