import {
  Component, input, output, model, computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import { MRipple } from '../m-ripple/m-ripple.directive';
import { MOverlayBadge } from '../m-overlay-badge/m-overlay-badge';

export type MToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type MToolbarVariant  = 'floating' | 'docked';

export interface MToolbarItem {
  id:        string;
  icon?:     string;
  label?:    string;
  active?:   boolean;
  disabled?: boolean;
  /** Separador visual entre grupos de items */
  divider?:  boolean;
  /** Badge numérico/texto superpuesto en el icono */
  badge?:    string;
  command?:  () => void;
}

@Component({
  selector: 'm-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MRipple, MOverlayBadge],
  templateUrl: './m-toolbar.html',
  styleUrl: './m-toolbar.css',
})
export class MToolbar {
  /** Posición del toolbar en pantalla */
  readonly position    = input<MToolbarPosition>('bottom');
  /** floating: fijo sobre el contenido | docked: estático en flujo */
  readonly variant     = input<MToolbarVariant>('floating');
  /** Lista de items */
  readonly items       = input<MToolbarItem[]>([]);
  /** Habilita el botón de colapsar/expandir */
  readonly collapsible = input(false);
  /** Estado colapsado (solo iconos) — enlazable con [(collapsed)] */
  readonly collapsed   = model(true);

  readonly itemClick = output<MToolbarItem>();

  readonly _isVertical = computed(
    () => this.position() === 'left' || this.position() === 'right',
  );

  readonly _cssClass = computed(() => {
    const parts = [
      'm-toolbar',
      `m-toolbar--${this.position()}`,
      `m-toolbar--${this.variant()}`,
      this._isVertical() ? 'm-toolbar--vertical' : 'm-toolbar--horizontal',
      this.collapsed()   ? 'm-toolbar--collapsed' : 'm-toolbar--expanded',
      this.collapsible() ? 'm-toolbar--collapsible' : '',
    ];
    return parts.filter(Boolean).join(' ');
  });

  readonly _toggleIcon = computed(() => {
    const pos = this.position();
    const col = this.collapsed();
    if (pos === 'bottom') return col ? 'lucide:chevron-up'    : 'lucide:chevron-down';
    if (pos === 'top')    return col ? 'lucide:chevron-down'  : 'lucide:chevron-up';
    if (pos === 'left')   return col ? 'lucide:chevron-right' : 'lucide:chevron-left';
    /* right */           return col ? 'lucide:chevron-left'  : 'lucide:chevron-right';
  });

  onItemClick(item: MToolbarItem): void {
    if (item.disabled) return;
    item.command?.();
    this.itemClick.emit(item);
  }

  toggle(): void {
    this.collapsed.update(v => !v);
  }
}
