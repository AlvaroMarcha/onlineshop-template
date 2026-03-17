import {
  Component, input, output, model,
  ChangeDetectionStrategy, HostListener,
  ElementRef, inject,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import { MRipple } from '../m-ripple/m-ripple.directive';
import { MContextMenuService } from './m-context-menu.service';

export type MContextMenuVariant   = 'list' | 'mini' | 'grid';
export type MContextMenuTrigger   = 'click' | 'contextmenu' | 'manual';
export type MContextMenuPlacement = 'auto' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'cursor';
export type MContextMenuSeverity  = 'default' | 'danger' | 'warn' | 'success';

export interface MContextMenuItem {
  id:        string;
  label?:    string;
  icon?:     string;
  /** Atajo de teclado visual (solo decorativo, no funcional) */
  shortcut?: string;
  severity?: MContextMenuSeverity;
  disabled?: boolean;
  /** Marca el ítem como activo/seleccionado */
  active?:   boolean;
  /** Fila separadora — ignora el resto de props */
  divider?:  boolean;
  command?:  () => void;
}

/**
 * m-context-menu — Componente declarativo con ng-content como trigger.
 * Para el modo "overlay sobre cualquier elemento" usa MContextMenuDirective [mContextMenu].
 */
@Component({
  selector: 'm-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MRipple],
  templateUrl: './m-context-menu.html',
  styleUrl: './m-context-menu.css',
  host: { style: 'display:inline-block; position:relative;' },
})
export class MContextMenu {
  private readonly service = inject(MContextMenuService);
  private readonly el      = inject(ElementRef<HTMLElement>);

  readonly variant   = input<MContextMenuVariant>('list');
  readonly trigger   = input<MContextMenuTrigger>('click');
  readonly placement = input<MContextMenuPlacement>('auto');
  readonly items     = input<MContextMenuItem[]>([]);
  readonly visible   = model(false);

  readonly itemClick = output<MContextMenuItem>();

  @HostListener('click', ['$event'])
  onHostClick(e: MouseEvent): void {
    if (this.trigger() !== 'click') return;
    e.stopPropagation();
    this._open(e.clientX, e.clientY);
  }

  @HostListener('contextmenu', ['$event'])
  onHostContextMenu(e: MouseEvent): void {
    if (this.trigger() !== 'contextmenu') return;
    e.preventDefault();
    e.stopPropagation();
    this._open(e.clientX, e.clientY);
  }

  private _open(x: number, y: number): void {
    this.visible.set(true);
    this.service.open({
      items:     this.items(),
      variant:   this.variant(),
      placement: this.placement(),
      anchorEl:  this.el.nativeElement,
      cursorX:   x,
      cursorY:   y,
      onSelect:  (item) => {
        this.itemClick.emit(item);
        this.visible.set(false);
      },
      onClose: () => this.visible.set(false),
    });
  }
}
