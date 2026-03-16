import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'iconify-icon';

/**
 * m-icon — Wrapper de iconify-icon web component.
 * Uso: <m-icon icon="lucide:home" size="24" />
 * Busca iconos en: https://icons0.dev/
 */
@Component({
  selector: 'm-icon',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <iconify-icon
      [attr.icon]="icon"
      [attr.width]="size"
      [attr.height]="size"
    ></iconify-icon>
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; line-height: 1; }'],
})
export class MIcon {
  /** Nombre del icono. Ej: 'lucide:home', 'mdi:account', 'ph:star' */
  @Input() icon = '';
  /** Tamaño en px o unidad CSS. Default: '1em' */
  @Input() size: string | number = '1em';
}
