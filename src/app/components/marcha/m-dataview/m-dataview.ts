import {
  Component, input, output, signal, computed,
  contentChild, TemplateRef, ChangeDetectionStrategy,
  effect, HostListener,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MIcon } from '../m-icon/m-icon';
import { MChip } from '../m-chip/m-chip';
import { FormsModule } from '@angular/forms';

export type MDataviewLayout = 'grid' | 'list';

export interface MDataviewSortOption {
  label: string;
  value: string;
  /** Campo del ítem usado para ordenar — si no se especifica, se usa `value` */
  sortField?: string;
  /** 'asc' | 'desc', por defecto 'asc' */
  direction?: 'asc' | 'desc';
}

/**
 * m-dataview — Visualizador de datos con alternancia grid/lista,
 * paginación integrada, skeleton loading y ordenación.
 *
 * Uso:
 *   <m-dataview [items]="products" [loading]="loading" [sortOptions]="sorts">
 *     <ng-template #gridItem let-item>...</ng-template>
 *     <ng-template #listItem let-item>...</ng-template>
 *   </m-dataview>
 */
@Component({
  selector: 'm-dataview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, MIcon, MChip, FormsModule],
  templateUrl: './m-dataview.html',
  styleUrl: './m-dataview.css',
})
export class MDataview<T = unknown> {
  // ─── Inputs ──────────────────────────────────────────────
  readonly items       = input<T[]>([]);
  readonly loading     = input(false);
  readonly layout      = input<MDataviewLayout>('grid');
  readonly rows        = input(12);
  readonly paginator   = input(true);
  readonly sortOptions = input<MDataviewSortOption[]>([]);
  /** Número de skeletons a mostrar mientras carga */
  readonly skeletonCount = input(8);
  readonly emptyMessage  = input('No hay datos disponibles');
  readonly emptyIcon     = input('lucide:package-open');
  readonly header        = input('');
  /** Nombre del campo del ítem que contiene la URL de imagen — activa lightbox al hacer clic */
  readonly imageField    = input('');
  /** Campos del ítem a renderizar como chips — grupo 1 (ej. categorías) */
  readonly chipsFields1  = input<string[]>([]);
  /** Campos del ítem a renderizar como chips — grupo 2 (ej. subcategorías / etiquetas) */
  readonly chipsFields2  = input<string[]>([]);

  // ─── Outputs ─────────────────────────────────────────────
  readonly layoutChange = output<MDataviewLayout>();
  readonly sortChange   = output<MDataviewSortOption | null>();
  readonly pageChange   = output<number>();

  // ─── Templates proyectados ───────────────────────────────
  readonly gridItemTpl = contentChild<TemplateRef<{ $implicit: T }>>('gridItem');
  readonly listItemTpl = contentChild<TemplateRef<{ $implicit: T }>>('listItem');

  // ─── Estado interno ──────────────────────────────────────
  readonly _layout       = signal<MDataviewLayout>('grid');
  readonly _currentPage  = signal(1);
  readonly _sortValue    = signal('');

  // Lightbox
  readonly _lightboxOpen    = signal(false);
  /** Imágenes de la galería del producto actualmente abierto */
  readonly _lightboxImages  = signal<string[]>([]);
  /** Índice dentro de la galería del producto */
  readonly _lightboxImgIdx  = signal(0);

  readonly _skeletonArray = computed(() => Array(this.skeletonCount()).fill(0));

  readonly _sortedItems = computed(() => {
    const all  = this.items();
    const key  = this._sortValue();
    if (!key) return all;

    const opt = this.sortOptions().find(o => o.value === key);
    if (!opt) return all;

    const dir     = opt.direction ?? 'asc';
    const sortKey = opt.sortField ?? key;
    return [...all].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null || bv == null) return 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly _pagedItems = computed(() => {
    if (!this.paginator()) return this._sortedItems();
    const page = this._currentPage();
    const size = this.rows();
    return this._sortedItems().slice((page - 1) * size, page * size);
  });

  readonly _totalPages = computed(() =>
    Math.max(1, Math.ceil(this._sortedItems().length / this.rows()))
  );

  readonly _pageNumbers = computed(() => {
    const total  = this._totalPages();
    const current = this._currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  readonly _sortSelectOptions = computed(() =>
    this.sortOptions().map(o => ({ label: o.label, value: o.value }))
  );

  readonly _lightboxImage = computed(() =>
    this._lightboxImages()[this._lightboxImgIdx()] ?? ''
  );

  /** Contador "x / n" — solo si hay más de 1 imagen */
  readonly _lightboxCounter = computed(() => {
    const n = this._lightboxImages().length;
    return n > 1 ? `${this._lightboxImgIdx() + 1} / ${n}` : '';
  });

  constructor() {
    // Sincronizar layout externo → estado interno
    effect(() => { this._layout.set(this.layout()); });
    // Resetear página al cambiar ítems o sort
    effect(() => {
      this.items();
      this._sortValue();
      this._currentPage.set(1);
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this._lightboxOpen()) return;
    if (e.key === 'Escape')     { e.preventDefault(); this.closeLightbox(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); this.lightboxPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.lightboxNext(); }
  }

  // ─── Métodos ─────────────────────────────────────────────
  setLayout(l: MDataviewLayout): void {
    this._layout.set(l);
    this.layoutChange.emit(l);
  }

  setPage(p: number | '...'): void {
    if (p === '...') return;
    this._currentPage.set(p);
    this.pageChange.emit(p);
  }

  prevPage(): void {
    if (this._currentPage() > 1) this.setPage(this._currentPage() - 1);
  }

  nextPage(): void {
    if (this._currentPage() < this._totalPages()) this.setPage(this._currentPage() + 1);
  }

  onSortChange(value: string): void {
    this._sortValue.set(value);
    const opt = this.sortOptions().find(o => o.value === value) ?? null;
    this.sortChange.emit(opt);
  }

  // ─── Lightbox ─────────────────────────────────────────────
  openLightbox(localIndex: number): void {
    const item = this._pagedItems()[localIndex];
    if (!item) return;
    const images = this.getImages(item as T);
    if (!images.length) return;
    this._lightboxImages.set(images);
    this._lightboxImgIdx.set(0);
    this._lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this._lightboxOpen.set(false);
    this._lightboxImages.set([]);
  }

  lightboxPrev(): void {
    const n = this._lightboxImages().length;
    if (n <= 1) return;
    this._lightboxImgIdx.set((this._lightboxImgIdx() - 1 + n) % n);
  }

  lightboxNext(): void {
    const n = this._lightboxImages().length;
    if (n <= 1) return;
    this._lightboxImgIdx.set((this._lightboxImgIdx() + 1) % n);
  }

  // ─── Chips ───────────────────────────────────────────────
  /**
   * Extrae los valores de los campos indicados del ítem como array de strings.
   * Si el campo contiene un array, expande sus elementos individuales.
   */
  getChips(item: T, fields: string[]): string[] {
    const result: string[] = [];
    for (const field of fields) {
      const val = (item as Record<string, unknown>)[field];
      if (Array.isArray(val)) {
        result.push(...val.map(String));
      } else if (val != null && val !== '') {
        result.push(String(val));
      }
    }
    return result;
  }

  // ─── Imagen ──────────────────────────────────────────────
  /**
   * Devuelve todas las URLs de imagen del ítem.
   * El campo puede ser un string (1 imagen) o un string[] (galería).
   */
  getImages(item: T): string[] {
    const field = this.imageField();
    if (!field) return [];
    const val = (item as Record<string, unknown>)[field];
    if (Array.isArray(val)) return (val as unknown[]).filter(Boolean).map(String);
    if (val != null && val !== '') return [String(val)];
    return [];
  }

  /** Miniatura: primera imagen del ítem */
  getImageUrl(item: T): string {
    return this.getImages(item)[0] ?? '';
  }
}
