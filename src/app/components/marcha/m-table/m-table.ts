import {
  Component, input, output, signal, computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MIcon }         from '../m-icon/m-icon';
import { MChip }         from '../m-chip/m-chip';
import { MAvatar }       from '../m-avatar/m-avatar';
import { MToggleSwitch } from '../m-toggle-switch/m-toggle-switch';
import type { MChipSeverity } from '../m-chip/m-chip';
import type { MToggleButtonSeverity } from '../m-toggle-button/m-toggle-button';

export type MTableVariant = 'default' | 'striped' | 'compact';
type SortDir = 'asc' | 'desc' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MTableRow = Record<string, any>;

export interface MTableAction {
  label: string;
  icon: string;
  /** Severity visual del botón */
  severity?: 'primary' | 'secondary' | 'danger' | 'warn' | 'success' | 'info';
  /** Ocultar la acción condicionalmente */
  hidden?: (row: MTableRow) => boolean;
  /** Deshabilitar la acción condicionalmente */
  disabled?: (row: MTableRow) => boolean;
}

export interface MTableToggleChange {
  row: MTableRow;
  field: string;
  value: boolean;
}

export interface MTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  /** text (default) | number | date | badge (→ m-chip) | avatar (→ m-avatar) | toggle (→ m-toggle-switch) | toggle-btn (botón estilo acción con severity) */
  type?: 'text' | 'number' | 'date' | 'badge' | 'avatar' | 'toggle' | 'toggle-btn';
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Para type='badge': severity según el valor de la celda */
  badgeSeverity?: (value: MTableRow[string], row: MTableRow) => MChipSeverity;
  /** Para type='badge': label personalizado (por defecto el valor como string) */
  badgeLabel?: (value: MTableRow[string], row: MTableRow) => string;
  /** Formateo libre del texto de la celda */
  format?: (value: MTableRow[string], row: MTableRow) => string;
  /** Para type='toggle-btn': label según el valor booleano */
  toggleLabel?: (value: boolean) => string;
  /** Para type='toggle-btn': icono del botón */
  toggleIcon?: string;
  /** Para type='toggle-btn': severity del botón (por defecto 'success') */
  toggleButtonSeverity?: MToggleButtonSeverity;
}

@Component({
  selector: 'm-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MChip, MAvatar, MToggleSwitch, FormsModule],
  templateUrl: './m-table.html',
  styleUrl: './m-table.css',
})
export class MTable {
  readonly columns      = input<MTableColumn[]>([]);
  readonly data         = input<MTableRow[]>([]);
  readonly actions      = input<MTableAction[]>([]);
  readonly loading      = input(false);
  readonly selectable   = input(false);
  readonly pageSize     = input(10);
  readonly caption      = input('');
  readonly variant      = input<MTableVariant>('default');
  readonly emptyMessage = input('Sin resultados');
  readonly trackByField = input<string>('id');

  readonly selectionChange = output<MTableRow[]>();
  readonly rowClick        = output<MTableRow>();
  readonly actionClick     = output<{ action: MTableAction; row: MTableRow }>();
  /** Emitido cuando el usuario opera un toggle (type='toggle') en una celda */
  readonly toggleChange    = output<{ row: MTableRow; field: string; value: boolean }>();

  // ---- Estado interno ----
  readonly currentPage   = signal(1);
  readonly sortField     = signal<string | null>(null);
  readonly sortDir       = signal<SortDir>(null);
  readonly showSearch    = signal(false);
  readonly filterText    = signal('');
  readonly selectedRows  = signal<Set<unknown>>(new Set());
  /** Fila con menú de acciones abierto (mobile kebab) */
  readonly openMenuRow   = signal<unknown>(null);

  readonly skeletonRows  = [1, 2, 3, 4, 5];

  // ---- Pipeline: filtro → orden → paginación ----
  readonly filteredData = computed(() => {
    const q = this.filterText().toLowerCase().trim();
    if (!q) return this.data();
    return this.data().filter(row =>
      Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q))
    );
  });

  readonly sortedData = computed(() => {
    const field = this.sortField();
    const dir   = this.sortDir();
    const rows  = [...this.filteredData()];
    if (!field || !dir) return rows;
    return rows.sort((a, b) => {
      const av = a[field], bv = b[field];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av instanceof Date && bv instanceof Date)
        return dir === 'asc' ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();
      if (typeof av === 'number' && typeof bv === 'number')
        return dir === 'asc' ? av - bv : bv - av;
      return dir === 'asc'
        ? String(av).localeCompare(String(bv), 'es')
        : String(bv).localeCompare(String(av), 'es');
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedData().length / this.pageSize()))
  );

  readonly pagedData = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const size  = this.pageSize();
    return this.sortedData().slice((page - 1) * size, page * size);
  });

  readonly totalCount = computed(() => this.filteredData().length);

  /** Números de página con puntos suspensivos para ventana deslizante */
  readonly pageNumbers = computed(() => {
    const total   = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as (number | '...')[];
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  /** ¿Todas las filas de la página actual están seleccionadas? */
  readonly allSelected = computed(() => {
    const keys = this.pagedData().map(r => r[this.trackByField()]);
    return keys.length > 0 && keys.every(k => this.selectedRows().has(k));
  });

  // ---- Ordenación ----
  sort(col: MTableColumn): void {
    if (!col.sortable) return;
    if (this.sortField() === col.field) {
      const next: SortDir = this.sortDir() === 'asc' ? 'desc' : this.sortDir() === 'desc' ? null : 'asc';
      this.sortDir.set(next);
      if (next === null) this.sortField.set(null);
    } else {
      this.sortField.set(col.field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  sortIcon(field: string): string {
    if (this.sortField() !== field) return 'lucide:chevrons-up-down';
    return this.sortDir() === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down';
  }

  // ---- Paginación ----
  goToPage(p: number | '...'): void { if (typeof p === 'number') this.currentPage.set(p); }
  prevPage(): void { this.currentPage.update(p => Math.max(1, p - 1)); }
  nextPage(): void { this.currentPage.update(p => Math.min(this.totalPages(), p + 1)); }

  // ---- Búsqueda ----
  toggleSearch(): void {
    this.showSearch.update(v => !v);
    if (!this.showSearch()) { this.filterText.set(''); this.currentPage.set(1); }
  }
  onSearch(e: Event): void {
    this.filterText.set((e.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  // ---- Selección ----
  toggleRow(row: MTableRow): void {
    if (!this.selectable()) { this.rowClick.emit(row); return; }
    const key = row[this.trackByField()];
    const set  = new Set(this.selectedRows());
    set.has(key) ? set.delete(key) : set.add(key);
    this.selectedRows.set(set);
    this.selectionChange.emit(this.data().filter(r => set.has(r[this.trackByField()])));
    this.rowClick.emit(row);
  }

  toggleAll(): void {
    const keys   = this.pagedData().map(r => r[this.trackByField()]);
    const set    = new Set(this.selectedRows());
    const addAll = !this.allSelected();
    addAll ? keys.forEach(k => set.add(k)) : keys.forEach(k => set.delete(k));
    this.selectedRows.set(set);
    this.selectionChange.emit(this.data().filter(r => set.has(r[this.trackByField()])));
  }

  isSelected(row: MTableRow): boolean { return this.selectedRows().has(row[this.trackByField()]); }

  // ---- Acciones ----
  visibleActions(row: MTableRow): MTableAction[] {
    return this.actions().filter(a => !a.hidden?.(row));
  }
  isActionDisabled(action: MTableAction, row: MTableRow): boolean {
    return action.disabled?.(row) ?? false;
  }
  triggerAction(action: MTableAction, row: MTableRow, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isActionDisabled(action, row)) return;
    this.closeMenu();
    this.actionClick.emit({ action, row });
  }
  toggleMenu(row: MTableRow, event: MouseEvent): void {
    event.stopPropagation();
    const key = row[this.trackByField()];
    this.openMenuRow.update(v => v === key ? null : key);
  }
  closeMenu(): void { this.openMenuRow.set(null); }
  isMenuOpen(row: MTableRow): boolean {
    return this.openMenuRow() === row[this.trackByField()];
  }

  // ---- Helpers de celda ----
  cellValue(row: MTableRow, field: string): MTableRow[string] { return row[field]; }

  badgeLabel(col: MTableColumn, v: MTableRow[string], row: MTableRow): string {
    return col.badgeLabel ? col.badgeLabel(v, row) : String(v ?? '');
  }
  badgeSeverity(col: MTableColumn, v: MTableRow[string], row: MTableRow): MChipSeverity {
    return col.badgeSeverity ? col.badgeSeverity(v, row) : 'secondary';
  }
  formatCell(col: MTableColumn, v: MTableRow[string], row: MTableRow): string {
    if (col.format) return col.format(v, row);
    if (col.type === 'date' && v instanceof Date)
      return v.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    if (col.type === 'number' && typeof v === 'number')
      return v.toLocaleString('es-ES');
    return String(v ?? '—');
  }

  trackRow(row: MTableRow): unknown { return row[this.trackByField()]; }

  // ---- Toggle cell ----
  onCellToggle(col: MTableColumn, row: MTableRow, value: boolean): void {
    this.toggleChange.emit({ row, field: col.field, value });
  }

  onToggleBtnClick(col: MTableColumn, row: MTableRow, event: Event): void {
    event.stopPropagation();
    this.toggleChange.emit({ row, field: col.field, value: !this.cellValue(row, col.field) });
  }
}
