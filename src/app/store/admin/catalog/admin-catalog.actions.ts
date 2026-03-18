import { createAction, props } from '@ngrx/store';
import {
  CategoryAdmin,
  CategoryCreateRequest,
  SubcategoryAdmin,
  SubcategoryCreateRequest,
} from '../../../type/admin-types';

// ── Cargar catálogo completo ───────────────────────────────────
export const adminCatalogLoad = createAction('[AdminCatalog] Load');
export const adminCatalogLoadSuccess = createAction(
  '[AdminCatalog] Load Success',
  props<{ categories: CategoryAdmin[] }>()
);

// ── Categorías ────────────────────────────────────────────────
export const adminCategoryCreate = createAction(
  '[AdminCatalog] Category Create',
  props<{ payload: CategoryCreateRequest }>()
);
export const adminCategoryCreateSuccess = createAction(
  '[AdminCatalog] Category Create Success',
  props<{ category: CategoryAdmin }>()
);

export const adminCategoryUpdate = createAction(
  '[AdminCatalog] Category Update',
  props<{ id: number; payload: Partial<CategoryCreateRequest> }>()
);
export const adminCategoryUpdateSuccess = createAction(
  '[AdminCatalog] Category Update Success',
  props<{ category: CategoryAdmin }>()
);

export const adminCategoryDelete = createAction(
  '[AdminCatalog] Category Delete',
  props<{ id: number }>()
);
export const adminCategoryDeleteSuccess = createAction(
  '[AdminCatalog] Category Delete Success',
  props<{ id: number }>()
);

// ── Subcategorías ─────────────────────────────────────────────
export const adminSubcategoryCreate = createAction(
  '[AdminCatalog] Subcategory Create',
  props<{ payload: SubcategoryCreateRequest }>()
);
export const adminSubcategoryCreateSuccess = createAction(
  '[AdminCatalog] Subcategory Create Success',
  props<{ categoryId: number; subcategory: SubcategoryAdmin }>()
);

export const adminSubcategoryUpdate = createAction(
  '[AdminCatalog] Subcategory Update',
  props<{ categoryId: number; id: number; payload: Partial<SubcategoryCreateRequest> }>()
);
export const adminSubcategoryUpdateSuccess = createAction(
  '[AdminCatalog] Subcategory Update Success',
  props<{ categoryId: number; subcategory: SubcategoryAdmin }>()
);

export const adminSubcategoryDelete = createAction(
  '[AdminCatalog] Subcategory Delete',
  props<{ categoryId: number; id: number }>()
);
export const adminSubcategoryDeleteSuccess = createAction(
  '[AdminCatalog] Subcategory Delete Success',
  props<{ categoryId: number; id: number }>()
);

// ── Toggle activo ──────────────────────────────────────────────
export const adminCategoryToggle = createAction(
  '[AdminCatalog] Category Toggle',
  props<{ id: number }>()
);
export const adminCategoryToggleSuccess = createAction(
  '[AdminCatalog] Category Toggle Success',
  props<{ category: CategoryAdmin }>()
);

export const adminSubcategoryToggle = createAction(
  '[AdminCatalog] Subcategory Toggle',
  props<{ categoryId: number; id: number }>()
);
export const adminSubcategoryToggleSuccess = createAction(
  '[AdminCatalog] Subcategory Toggle Success',
  props<{ categoryId: number; subcategory: SubcategoryAdmin }>()
);

// ── Error genérico ─────────────────────────────────────────────
export const adminCatalogFailure = createAction(
  '[AdminCatalog] Failure',
  props<{ error: string }>()
);
