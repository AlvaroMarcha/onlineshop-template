import { createAction, props } from '@ngrx/store';
import { ProductAdmin, ProductCreateRequest, ProductUpdateRequest, ProductSearchParams, ProductAttrib } from '../../../type/admin-types';
import { Page } from '../../../type/admin-types';

// ── Búsqueda / listado ─────────────────────────────────────────
export const adminProductsSearch = createAction(
  '[AdminProducts] Search',
  props<{ params: ProductSearchParams }>()
);
export const adminProductsSearchSuccess = createAction(
  '[AdminProducts] Search Success',
  props<{ page: Page<ProductAdmin> }>()
);

// ── Detalle ────────────────────────────────────────────────────
export const adminProductLoad = createAction(
  '[AdminProducts] Load',
  props<{ id: number }>()
);
export const adminProductLoadSuccess = createAction(
  '[AdminProducts] Load Success',
  props<{ product: ProductAdmin }>()
);
export const adminProductClear = createAction('[AdminProducts] Clear Selected');

// ── Crear ──────────────────────────────────────────────────────
export const adminProductCreate = createAction(
  '[AdminProducts] Create',
  props<{ payload: ProductCreateRequest }>()
);
export const adminProductCreateSuccess = createAction(
  '[AdminProducts] Create Success',
  props<{ product: ProductAdmin }>()
);

// ── Actualizar ─────────────────────────────────────────────────
export const adminProductUpdate = createAction(
  '[AdminProducts] Update',
  props<{ id: number; payload: ProductUpdateRequest }>()
);
export const adminProductUpdateSuccess = createAction(
  '[AdminProducts] Update Success',
  props<{ product: ProductAdmin }>()
);

// ── Eliminar ───────────────────────────────────────────────────
export const adminProductDelete = createAction(
  '[AdminProducts] Delete',
  props<{ id: number }>()
);
export const adminProductDeleteSuccess = createAction(
  '[AdminProducts] Delete Success',
  props<{ id: number }>()
);

// ── Atributos ──────────────────────────────────────────────────
export const adminProductsLoadAttribs = createAction('[AdminProducts] Load Attribs');
export const adminProductsLoadAttribsSuccess = createAction(
  '[AdminProducts] Load Attribs Success',
  props<{ attribs: ProductAttrib[] }>()
);

// ── Error genérico ─────────────────────────────────────────────
export const adminProductsFailure = createAction(
  '[AdminProducts] Failure',
  props<{ error: string }>()
);
