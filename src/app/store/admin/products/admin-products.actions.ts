import { createAction, props } from '@ngrx/store';
import { ProductAdmin, ProductCreateRequest, ProductUpdateRequest, ProductSearchParams, ProductAttrib, ProductAttribValue } from '../../../type/admin-types';
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

// ── Atributos CRUD ─────────────────────────────────────────────
export const adminAttribCreate = createAction(
  '[AdminProducts] Attrib Create',
  props<{ name: string }>()
);
export const adminAttribCreateSuccess = createAction(
  '[AdminProducts] Attrib Create Success',
  props<{ attrib: ProductAttrib }>()
);

export const adminAttribUpdate = createAction(
  '[AdminProducts] Attrib Update',
  props<{ id: number; name: string }>()
);
export const adminAttribUpdateSuccess = createAction(
  '[AdminProducts] Attrib Update Success',
  props<{ attrib: ProductAttrib }>()
);

export const adminAttribDelete = createAction(
  '[AdminProducts] Attrib Delete',
  props<{ id: number }>()
);
export const adminAttribDeleteSuccess = createAction(
  '[AdminProducts] Attrib Delete Success',
  props<{ id: number }>()
);

// ── Valores de atributo CRUD ───────────────────────────────────
export const adminAttribValueCreate = createAction(
  '[AdminProducts] Attrib Value Create',
  props<{ attribId: number; value: string }>()
);
export const adminAttribValueCreateSuccess = createAction(
  '[AdminProducts] Attrib Value Create Success',
  props<{ attribId: number; attribValue: ProductAttribValue }>()
);

export const adminAttribValueUpdate = createAction(
  '[AdminProducts] Attrib Value Update',
  props<{ attribId: number; valueId: number; value: string }>()
);
export const adminAttribValueUpdateSuccess = createAction(
  '[AdminProducts] Attrib Value Update Success',
  props<{ attribId: number; attribValue: ProductAttribValue }>()
);

export const adminAttribValueDelete = createAction(
  '[AdminProducts] Attrib Value Delete',
  props<{ attribId: number; valueId: number }>()
);
export const adminAttribValueDeleteSuccess = createAction(
  '[AdminProducts] Attrib Value Delete Success',
  props<{ attribId: number; valueId: number }>()
);

// ── Error genérico ─────────────────────────────────────────────
export const adminProductsFailure = createAction(
  '[AdminProducts] Failure',
  props<{ error: string }>()
);
