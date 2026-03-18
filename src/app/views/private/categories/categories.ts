import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import {
  MCard, MButton, MTable, MIcon, MDialog, MInput, MChip,
} from '../../../components/marcha';
import type { MTableColumn, MTableAction, MTableToggleChange } from '../../../components/marcha';
import {
  adminCatalogLoad,
  adminCategoryCreate,
  adminCategoryUpdate,
  adminCategoryDelete,
  adminCategoryToggle,
  adminSubcategoryCreate,
  adminSubcategoryUpdate,
  adminSubcategoryDelete,
  adminSubcategoryToggle,
} from '../../../store/admin/catalog/admin-catalog.actions';
import {
  selectAdminCatalogCategories,
  selectAdminCatalogLoading,
  selectAdminCatalogSaving,
  selectAdminCatalogToggling,
  selectAdminCatalogError,
} from '../../../store/admin/catalog/admin-catalog.selectors';
import { CategoryAdmin, SubcategoryAdmin } from '../../../type/admin-types';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, ReactiveFormsModule, FormsModule,
    MCard, MButton, MTable, MIcon, MDialog, MInput, MChip,
  ],
  templateUrl: './categories.html',
  styleUrl:    './categories.css',
})
export class CategoriesAdmin implements OnInit {
  private store = inject(Store);

  // ── Store ────────────────────────────────────────────────────
  readonly allCategories = toSignal(this.store.select(selectAdminCatalogCategories), { initialValue: [] });
  readonly loading       = toSignal(this.store.select(selectAdminCatalogLoading),    { initialValue: false });
  readonly saving        = toSignal(this.store.select(selectAdminCatalogSaving),     { initialValue: false });
  readonly toggling      = toSignal(this.store.select(selectAdminCatalogToggling),   { initialValue: false });
  readonly error         = toSignal(this.store.select(selectAdminCatalogError));

  // ── Filtro local ─────────────────────────────────────────────
  readonly searchTerm = signal('');

  readonly categories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allCategories();
    return this.allCategories().filter(c =>
      c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
    );
  });

  // ── Panel de subcategorías ────────────────────────────────────
  readonly selectedCategory = signal<CategoryAdmin | null>(null);

  readonly subcategoryRows = computed(() => {
    const cat = this.allCategories().find(c => c.id === this.selectedCategory()?.id);
    return cat?.subcategories ?? [];
  });

  // ── Diálogos de categoría ─────────────────────────────────────
  readonly categoryDialogVisible = signal(false);
  readonly categoryDialogMode    = signal<'create' | 'edit'>('create');
  readonly categoryTarget        = signal<CategoryAdmin | null>(null);

  readonly categoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // ── Diálogo de borrado de categoría ──────────────────────────
  readonly deleteCategoryDialogVisible = signal(false);
  readonly deleteCategoryTarget        = signal<CategoryAdmin | null>(null);

  // ── Diálogos de subcategoría ──────────────────────────────────
  readonly subcategoryDialogVisible = signal(false);
  readonly subcategoryDialogMode    = signal<'create' | 'edit'>('create');
  readonly subcategoryTarget        = signal<SubcategoryAdmin | null>(null);

  readonly subcategoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // ── Diálogo de borrado de subcategoría ───────────────────────
  readonly deleteSubcategoryDialogVisible = signal(false);
  readonly deleteSubcategoryTarget        = signal<SubcategoryAdmin | null>(null);

  // ── Columnas tabla categorías ─────────────────────────────────
  readonly categoryColumns: MTableColumn[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'slug', header: 'Slug' },
    {
      field: 'active', header: 'Estado', type: 'toggle-btn', align: 'center', width: '120px',
      toggleLabel: (v) => v ? 'Activa' : 'Inactiva',
      toggleIcon: 'lucide:circle-dot',
      toggleButtonSeverity: 'success',
    },
    {
      field: 'subcategories', header: 'Subcategorías', align: 'center',
      format: (v) => String((v as SubcategoryAdmin[])?.length ?? 0),
    },
  ];

  readonly categoryActions: MTableAction[] = [
    { label: 'Subcategorías', icon: 'category', severity: 'info'    },
    { label: 'Editar',        icon: 'edit',     severity: 'primary' },
    { label: 'Eliminar',      icon: 'delete',   severity: 'danger'  },
  ];

  // ── Columnas tabla subcategorías ──────────────────────────────
  readonly subcategoryColumns: MTableColumn[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'slug', header: 'Slug' },
    {
      field: 'active', header: 'Estado', type: 'toggle-btn', align: 'center', width: '120px',
      toggleLabel: (v) => v ? 'Activa' : 'Inactiva',
      toggleIcon: 'lucide:circle-dot',
      toggleButtonSeverity: 'success',
    },
  ];

  readonly subcategoryActions: MTableAction[] = [
    { label: 'Editar',   icon: 'edit',   severity: 'primary' },
    { label: 'Eliminar', icon: 'delete', severity: 'danger'  },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit() {
    this.store.dispatch(adminCatalogLoad());
  }

  // ── Acciones de categoría ─────────────────────────────────────
  onCategoryAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const cat = event.row as unknown as CategoryAdmin;
    if (event.action.label === 'Subcategorías') {
      this.selectedCategory.set(cat);
    } else if (event.action.label === 'Editar') {
      this.openCategoryEditDialog(cat);
    } else if (event.action.label === 'Eliminar') {
      this.deleteCategoryTarget.set(cat);
      this.deleteCategoryDialogVisible.set(true);
    }
  }

  onCategoryToggle(event: MTableToggleChange) {
    const cat = event.row as unknown as CategoryAdmin;
    this.store.dispatch(adminCategoryToggle({ id: cat.id }));
  }

  openCategoryCreateDialog() {
    this.categoryDialogMode.set('create');
    this.categoryTarget.set(null);
    this.categoryForm.reset();
    this.categoryDialogVisible.set(true);
  }

  openCategoryEditDialog(cat: CategoryAdmin) {
    this.categoryDialogMode.set('edit');
    this.categoryTarget.set(cat);
    this.categoryForm.setValue({ name: cat.name });
    this.categoryDialogVisible.set(true);
  }

  submitCategory() {
    if (this.categoryForm.invalid) return;
    const { name } = this.categoryForm.getRawValue();
    const target = this.categoryTarget();
    if (this.categoryDialogMode() === 'create') {
      this.store.dispatch(adminCategoryCreate({ payload: { name } }));
    } else if (target) {
      this.store.dispatch(adminCategoryUpdate({ id: target.id, payload: { name } }));
    }
    this.categoryDialogVisible.set(false);
  }

  confirmDeleteCategory() {
    const cat = this.deleteCategoryTarget();
    if (cat) {
      this.store.dispatch(adminCategoryDelete({ id: cat.id }));
      if (this.selectedCategory()?.id === cat.id) {
        this.selectedCategory.set(null);
      }
    }
    this.deleteCategoryDialogVisible.set(false);
    this.deleteCategoryTarget.set(null);
  }

  // ── Acciones de subcategoría ──────────────────────────────────
  onSubcategoryAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const sub = event.row as unknown as SubcategoryAdmin;
    if (event.action.label === 'Editar') {
      this.openSubcategoryEditDialog(sub);
    } else if (event.action.label === 'Eliminar') {
      this.deleteSubcategoryTarget.set(sub);
      this.deleteSubcategoryDialogVisible.set(true);
    }
  }

  onSubcategoryToggle(event: MTableToggleChange) {
    const sub = event.row as unknown as SubcategoryAdmin;
    const cat = this.selectedCategory();
    if (cat) this.store.dispatch(adminSubcategoryToggle({ categoryId: cat.id, id: sub.id }));
  }

  openSubcategoryCreateDialog() {
    this.subcategoryDialogMode.set('create');
    this.subcategoryTarget.set(null);
    this.subcategoryForm.reset();
    this.subcategoryDialogVisible.set(true);
  }

  openSubcategoryEditDialog(sub: SubcategoryAdmin) {
    this.subcategoryDialogMode.set('edit');
    this.subcategoryTarget.set(sub);
    this.subcategoryForm.setValue({ name: sub.name });
    this.subcategoryDialogVisible.set(true);
  }

  submitSubcategory() {
    if (this.subcategoryForm.invalid) return;
    const { name } = this.subcategoryForm.getRawValue();
    const cat = this.selectedCategory();
    if (!cat) return;
    const target = this.subcategoryTarget();
    if (this.subcategoryDialogMode() === 'create') {
      this.store.dispatch(adminSubcategoryCreate({ payload: { name, categoryId: cat.id } }));
    } else if (target) {
      this.store.dispatch(adminSubcategoryUpdate({ categoryId: cat.id, id: target.id, payload: { name } }));
    }
    this.subcategoryDialogVisible.set(false);
  }

  confirmDeleteSubcategory() {
    const cat = this.selectedCategory();
    const sub = this.deleteSubcategoryTarget();
    if (cat && sub) {
      this.store.dispatch(adminSubcategoryDelete({ categoryId: cat.id, id: sub.id }));
    }
    this.deleteSubcategoryDialogVisible.set(false);
    this.deleteSubcategoryTarget.set(null);
  }
}

