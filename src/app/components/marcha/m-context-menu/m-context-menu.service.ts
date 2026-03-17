import { Injectable, DOCUMENT, inject } from '@angular/core';
import type { MContextMenuItem, MContextMenuVariant, MContextMenuPlacement } from './m-context-menu';

export interface MContextMenuOpenConfig {
  items:     MContextMenuItem[];
  variant:   MContextMenuVariant;
  placement: MContextMenuPlacement;
  anchorEl:  HTMLElement;
  cursorX:   number;
  cursorY:   number;
  onSelect:  (item: MContextMenuItem) => void;
  onClose:   () => void;
}

/**
 * Singleton que gestiona un único panel flotante en document.body.
 * Tanto MContextMenu (component) como MContextMenuDirective delegan aquí.
 */
@Injectable({ providedIn: 'root' })
export class MContextMenuService {
  private readonly doc = inject(DOCUMENT);

  private panel:       HTMLElement | null = null;
  private closeHandler: (() => void) | null = null;
  private keyHandler:   (() => void) | null = null;
  private focusedIndex = -1;

  open(config: MContextMenuOpenConfig): void {
    this.close();

    const panel = this.doc.createElement('div');
    panel.className = `m-ctx m-ctx--${config.variant}`;
    panel.setAttribute('role', 'menu');
    panel.setAttribute('tabindex', '-1');

    this._buildItems(panel, config);
    this.doc.body.appendChild(panel);
    this.panel = panel;

    this._position(panel, config);

    // Cierre al clicar fuera
    const closeHandler = (e: Event) => {
      if (!panel.contains(e.target as Node)) this.close(config.onClose);
    };
    setTimeout(() => this.doc.addEventListener('click', closeHandler, { capture: true }), 0);
    this.closeHandler = () => {
      this.doc.removeEventListener('click', closeHandler, { capture: true });
    };

    // Teclado: Escape + flechas + Enter
    const keyHandler = (e: KeyboardEvent) => this._onKey(e, config);
    this.doc.addEventListener('keydown', keyHandler);
    this.keyHandler = () => this.doc.removeEventListener('keydown', keyHandler);

    // Scroll/resize → cerrar
    const scrollHandler = () => this.close(config.onClose);
    this.doc.addEventListener('scroll', scrollHandler, { once: true, capture: true });

    panel.focus();
  }

  close(onClose?: () => void): void {
    this.panel?.remove();
    this.panel = null;
    this.focusedIndex = -1;
    this.closeHandler?.();
    this.closeHandler = null;
    this.keyHandler?.();
    this.keyHandler = null;
    onClose?.();
  }

  private _buildItems(panel: HTMLElement, config: MContextMenuOpenConfig): void {
    const actionItems = config.items.filter(i => !i.divider);

    config.items.forEach((item, idx) => {
      if (item.divider) {
        const sep = this.doc.createElement('div');
        sep.className = 'm-ctx__divider';
        sep.setAttribute('role', 'separator');
        panel.appendChild(sep);
        return;
      }

      const btn = this.doc.createElement('button');
      btn.type = 'button';
      btn.className = [
        'm-ctx__item',
        item.severity && item.severity !== 'default' ? `m-ctx__item--${item.severity}` : '',
        item.disabled ? 'is-disabled' : '',
        item.active   ? 'is-active'   : '',
      ].filter(Boolean).join(' ');
      btn.setAttribute('role', 'menuitem');
      btn.setAttribute('tabindex', '-1');
      if (item.disabled) btn.setAttribute('aria-disabled', 'true');
      btn.dataset['itemId'] = item.id;

      if (config.variant === 'mini') {
        // Solo icono + title como tooltip nativo
        btn.title = item.label ?? item.id;
        if (item.icon) btn.innerHTML = this._iconSvg(item.icon);
      } else if (config.variant === 'grid') {
        btn.innerHTML = `
          ${item.icon ? this._iconSvg(item.icon) : ''}
          <span class="m-ctx__item-label">${item.label ?? item.id}</span>
        `;
      } else {
        // list
        btn.innerHTML = `
          ${item.icon ? `<span class="m-ctx__item-icon">${this._iconSvg(item.icon)}</span>` : '<span class="m-ctx__item-icon-placeholder"></span>'}
          <span class="m-ctx__item-label">${item.label ?? item.id}</span>
          ${item.shortcut ? `<span class="m-ctx__item-shortcut">${item.shortcut}</span>` : ''}
        `;
      }

      if (!item.disabled) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          item.command?.();
          config.onSelect(item);
          this.close();
        });
      }

      panel.appendChild(btn);
    });
  }

  private _position(panel: HTMLElement, config: MContextMenuOpenConfig): void {
    // Renderizar offscreen para medir
    panel.style.visibility = 'hidden';
    panel.style.position   = 'fixed';
    panel.style.top        = '0';
    panel.style.left       = '0';

    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const vw = this.doc.documentElement.clientWidth;
    const vh = this.doc.documentElement.clientHeight;
    const gap = 4;

    let x = 0, y = 0;

    if (config.placement === 'cursor') {
      x = config.cursorX;
      y = config.cursorY;
    } else {
      const rect = config.anchorEl.getBoundingClientRect();
      const isTop    = config.placement.startsWith('top');
      const isEnd    = config.placement.endsWith('end');
      const isAuto   = config.placement === 'auto';

      // Posición base
      if (isAuto || !isTop) {
        y = rect.bottom + gap;
      } else {
        y = rect.top - ph - gap;
      }

      if (isAuto || !isEnd) {
        x = rect.left;
      } else {
        x = rect.right - pw;
      }

      // Smart flip auto
      if (isAuto) {
        if (y + ph > vh && rect.top - ph - gap > 0) y = rect.top - ph - gap;
        if (x + pw > vw) x = rect.right - pw;
      }
    }

    // Clamp al viewport
    x = Math.max(gap, Math.min(x, vw - pw - gap));
    y = Math.max(gap, Math.min(y, vh - ph - gap));

    panel.style.left       = `${x}px`;
    panel.style.top        = `${y}px`;
    panel.style.visibility = '';
  }

  private _onKey(e: KeyboardEvent, config: MContextMenuOpenConfig): void {
    if (!this.panel) return;

    const btns = Array.from(
      this.panel.querySelectorAll<HTMLButtonElement>('.m-ctx__item:not(.is-disabled)'),
    );
    if (!btns.length) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close(config.onClose);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % btns.length;
      btns[this.focusedIndex].focus();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + btns.length) % btns.length;
      btns[this.focusedIndex].focus();
      return;
    }

    if (e.key === 'Enter' && this.focusedIndex >= 0) {
      e.preventDefault();
      btns[this.focusedIndex].click();
    }
  }

  /**
   * Genera SVG inline para los iconos Lucide usando Iconify.
   * En prod se sustituye por un data-icon attribute y se deja al componente MIcon,
   * pero aquí necesitamos DOM puro sin Angular components.
   */
  private _iconSvg(icon: string): string {
    return `<iconify-icon icon="${icon}" width="1em" height="1em" aria-hidden="true" style="display:inline-flex;align-items:center"></iconify-icon>`;
  }
}
