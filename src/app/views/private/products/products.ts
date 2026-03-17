import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  MCard, MButton, MTable, MIcon, MDialog, MInput, MSelect, MChip,
} from '../../../components/marcha';
import type { MTableColumn, MTableAction, MChipSeverity, MSelectOption } from '../../../components/marcha';
import {
  adminProductsSearch,
  adminProductDelete,
} from '../../../store/admin/products/admin-products.actions';
import {
  selectAdminProductsList,
  selectAdminProductsTotal,
  selectAdminProductsPage,
  selectAdminProductLoading,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import { ProductAdmin, ProductSearchParams } from '../../../type/admin-types';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, ReactiveFormsModule,
    MCard, MButton, MTable, MIcon, MDialog, MInput, MSelect, MChip,
  ],
  templateUrl: './products.html',
  styleUrl:    './products.css',
})
export class ProductsAdmin implements OnInit {
  private store  = inject(Store);
  private router = inject(Router);

  // ── Store selectors ──────────────────────────────────────────
  readonly products = toSignal(this.store.select(selectAdminProductsList), { initialValue: [] });
  readonly total    = toSignal(this.store.select(selectAdminProductsTotal), { initialValue: 0 });
  readonly page     = toSignal(this.store.select(selectAdminProductsPage));
  readonly loading  = toSignal(this.store.select(selectAdminProductLoading), { initialValue: false });
  readonly error    = toSignal(this.store.select(selectAdminProductError));

  // ── Filtros (form) ────────────────────────────────────────────
  readonly filters = new FormGroup({
    q:             new FormControl<string>('', { nonNullable: true }),
    activeFilter:  new FormControl<string>('all', { nonNullable: true }),
    featuredFilter:new FormControl<string>('all', { nonNullable: true }),
  });

  // ── Paginación local ─────────────────────────────────────────
  readonly pageSize  = signal(20);
  readonly pageIndex = signal(0);

  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
  readonly pageNums   = computed(() => {
    const n = this.totalPages();
    return Array.from({ length: n }, (_, i) => i + 1);
  });

  // ── Diálogo de confirmación de borrado ────────────────────────
  readonly deleteDialogVisible = signal(false);
  readonly deleteTarget        = signal<ProductAdmin | null>(null);

  // ── Opciones de select ────────────────────────────────────────
  readonly activeOptions: MSelectOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
  ];
  readonly featuredOptions: MSelectOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Destacados', value: 'featured' },
    { label: 'No destacados', value: 'normal' },
  ];

  // ── Columnas de la tabla ──────────────────────────────────────
  readonly columns: MTableColumn[] = [
    {
      field: 'name', header: 'Producto',
      format: (_v, row) => `${row['name']} · ${row['sku'] ?? ''}`,
    },
    {
      field: 'price', header: 'Precio', type: 'number', align: 'right',
      format: (v, row) => row['discountPrice']
        ? `${Number(row['discountPrice']).toFixed(2)} €`
        : `${Number(v).toFixed(2)} €`,
    },
    {
      field: 'stock', header: 'Stock', align: 'center',
      type: 'badge',
      badgeSeverity: (v, row) => this.stockSeverity(Number(v), row['lowStockThreshold']),
      badgeLabel:    (v) => String(v),
    },
    {
      field: 'isActive', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'success' : 'secondary') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Activo' : 'Inactivo'),
    },
    {
      field: 'isFeatured', header: 'Destacado', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'warn' : 'secondary') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Sí' : 'No'),
    },
  ];

  readonly actions: MTableAction[] = [
    { label: 'Editar',   icon: 'edit',   severity: 'primary'  },
    { label: 'Eliminar', icon: 'delete', severity: 'danger'   },
  ];

  ngOnInit() {
    this.loadProducts();
    // Escucha cambios en los filtros de texto con debounce
    this.filters.controls.q.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.pageIndex.set(0);
      this.loadProducts();
    });
    // Cambios inmediatos en los selects
    this.filters.controls.activeFilter.valueChanges.subscribe(() => {
      this.pageIndex.set(0);
      this.loadProducts();
    });
    this.filters.controls.featuredFilter.valueChanges.subscribe(() => {
      this.pageIndex.set(0);
      this.loadProducts();
    });
  }

  loadProducts() {
    const { q, activeFilter, featuredFilter } = this.filters.getRawValue();
    const params: ProductSearchParams = {
      page: this.pageIndex(),
      size: this.pageSize(),
      includeInactive: activeFilter !== 'active',
      q:       q || undefined,
      featured: featuredFilter === 'featured' ? true : featuredFilter === 'normal' ? false : undefined,
    };
    this.store.dispatch(adminProductsSearch({ params }));
  }

  onAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const product = event.row as unknown as ProductAdmin;
    if (event.action.label === 'Editar') {
      this.router.navigate(['/admin/products', product.id]);
    } else if (event.action.label === 'Eliminar') {
      this.deleteTarget.set(product);
      this.deleteDialogVisible.set(true);
    }
  }

  confirmDelete() {
    const p = this.deleteTarget();
    if (p) {
      this.store.dispatch(adminProductDelete({ id: p.id }));
    }
    this.deleteDialogVisible.set(false);
    this.deleteTarget.set(null);
  }

  cancelDelete() {
    this.deleteDialogVisible.set(false);
    this.deleteTarget.set(null);
  }

  navigateToCreate() {
    this.router.navigate(['/admin/products/new']);
  }

  goToPage(n: number) {
    this.pageIndex.set(n);
    this.loadProducts();
  }

  prevPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update(p => p - 1);
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1) {
      this.pageIndex.update(p => p + 1);
      this.loadProducts();
    }
  }

  private stockSeverity(stock: number, threshold: number): MChipSeverity {
    if (stock === 0) return 'danger';
    if (stock <= threshold) return 'warn';
    return 'success';
  }
}

