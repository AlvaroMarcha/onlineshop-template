import {
  Directive, input, output, OnDestroy,
  ElementRef, inject, HostListener,
} from '@angular/core';
import { MContextMenuService } from './m-context-menu.service';
import type { MContextMenuItem, MContextMenuVariant, MContextMenuPlacement } from './m-context-menu';

/**
 * MContextMenuDirective — [mContextMenu]
 *
 * Aplica un menú contextual sobre CUALQUIER elemento existente sin modificar su estructura.
 * Ideal para el "modo admin": se añade dinámicamente según el rol del usuario.
 *
 * Uso:
 *   <app-product-card
 *     [mContextMenu]="getActions(product)"
 *     [mContextMenuEnabled]="isAdminMode()"
 *     mContextMenuTrigger="contextmenu"
 *     (mContextMenuSelect)="onAction($event, product)"
 *   />
 */
@Directive({
  selector: '[mContextMenu]',
  standalone: true,
})
export class MContextMenuDirective implements OnDestroy {
  private readonly service = inject(MContextMenuService);
  private readonly el      = inject(ElementRef<HTMLElement>);

  /** Lista de items del menú */
  readonly mContextMenu        = input.required<MContextMenuItem[]>();
  /** Variante visual: list | mini | grid */
  readonly mContextMenuVariant = input<MContextMenuVariant>('list');
  /** Tipo de trigger: click | contextmenu */
  readonly mContextMenuTrigger = input<'click' | 'contextmenu'>('contextmenu');
  /** Placement del panel */
  readonly mContextMenuPlacement = input<MContextMenuPlacement>('auto');
  /** Activar/desactivar sin quitar la directiva (ej: solo en modo admin) */
  readonly mContextMenuEnabled = input(true);

  /** Item seleccionado por el usuario */
  readonly mContextMenuSelect = output<MContextMenuItem>();

  @HostListener('click', ['$event'])
  onHostClick(e: MouseEvent): void {
    if (!this.mContextMenuEnabled()) return;
    if (this.mContextMenuTrigger() !== 'click') return;
    e.stopPropagation();
    this._open(e.clientX, e.clientY);
  }

  @HostListener('contextmenu', ['$event'])
  onHostContextMenu(e: MouseEvent): void {
    if (!this.mContextMenuEnabled()) return;
    if (this.mContextMenuTrigger() !== 'contextmenu') return;
    e.preventDefault();
    e.stopPropagation();
    this._open(e.clientX, e.clientY);
  }

  private _open(x: number, y: number): void {
    this.service.open({
      items:     this.mContextMenu(),
      variant:   this.mContextMenuVariant(),
      placement: this.mContextMenuPlacement() === 'auto' && this.mContextMenuTrigger() === 'contextmenu'
        ? 'cursor'
        : this.mContextMenuPlacement(),
      anchorEl:  this.el.nativeElement,
      cursorX:   x,
      cursorY:   y,
      onSelect:  (item) => this.mContextMenuSelect.emit(item),
      onClose:   () => {},
    });
  }

  ngOnDestroy(): void {
    this.service.close();
  }
}
