import {
  Component, input, output, signal, computed, ChangeDetectionStrategy, HostListener,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export interface MMenubarItem {
  label:     string;
  icon?:     string;
  items?:    MMenubarSubItem[];
  disabled?: boolean;
  isActive?: boolean;
  command?:  () => void;
}

export interface MMenubarSubItem {
  label?:    string;
  icon?:     string;
  disabled?: boolean;
  divider?:  boolean;
  isActive?: boolean;
  command?:  () => void;
}

@Component({
  selector: 'm-menubar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-menubar.html',
  styleUrl: './m-menubar.css',
  host: { '[style.display]': '"block"' },
})
export class MMenubar {
  readonly items     = input.required<MMenubarItem[]>();
  readonly logo      = input('');
  readonly logoIcon  = input('');
  readonly fullWidth = input(false);
  readonly contained = input(false);
  readonly maxWidth  = input('1280px');

  readonly itemClick = output<MMenubarItem | MMenubarSubItem>();
  readonly logoClick = output<void>();

  readonly _openIndex    = signal<number | null>(null);
  readonly _mobileOpen   = signal(false);
  readonly _mobileExpand = signal<number | null>(null);

  readonly navClass = computed(() => {
    const c = ['m-menubar'];
    if (this.fullWidth() || this.contained()) c.push('m-menubar--bar');
    if (this.contained()) c.push('m-menubar--contained');
    return c.join(' ');
  });

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    if (!(e.target as Element).closest?.('m-menubar')) {
      this._openIndex.set(null);
      this._mobileOpen.set(false);
    }
  }

  onItemClick(i: number, item: MMenubarItem, e: Event): void {
    e.stopPropagation();
    if (item.disabled) return;
    if (!item.items?.length) {
      this._openIndex.set(null);
      this.itemClick.emit(item);
      return;
    }
    this._openIndex.update(cur => cur === i ? null : i);
  }

  onSubClick(sub: MMenubarSubItem, e: Event): void {
    if (sub.disabled || sub.divider) return;
    e.stopPropagation();
    this._openIndex.set(null);
    this.itemClick.emit(sub);
  }

  toggleMobile(e: Event): void {
    e.stopPropagation();
    this._mobileOpen.update(v => !v);
    this._mobileExpand.set(null);
  }

  toggleMobileItem(i: number, item: MMenubarItem, e: Event): void {
    e.stopPropagation();
    if (item.disabled) return;
    if (!item.items?.length) {
      this._mobileOpen.set(false);
      this.itemClick.emit(item);
      return;
    }
    this._mobileExpand.update(cur => cur === i ? null : i);
  }

  onMobileSubClick(sub: MMenubarSubItem, e: Event): void {
    if (sub.disabled || sub.divider) return;
    e.stopPropagation();
    this._mobileOpen.set(false);
    this.itemClick.emit(sub);
  }
}
