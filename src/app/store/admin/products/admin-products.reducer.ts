import { createReducer, on } from '@ngrx/store';
import { initialAdminProductState } from './admin-products.state';
import * as A from './admin-products.actions';

export const adminProductsReducer = createReducer(
  initialAdminProductState,

  // loading
  on(A.adminProductsSearch,
     A.adminProductLoad,
     (state) => ({ ...state, loading: true, error: null })
  ),
  on(A.adminProductCreate,
     A.adminProductUpdate,
     A.adminProductDelete,
     (state) => ({ ...state, saving: true, error: null })
  ),

  // search
  on(A.adminProductsSearchSuccess, (state, { page }) => ({
    ...state, loading: false, page,
  })),

  // load single
  on(A.adminProductLoadSuccess, (state, { product }) => ({
    ...state, loading: false, selected: product,
  })),
  on(A.adminProductClear, (state) => ({
    ...state, selected: null,
  })),

  // create
  on(A.adminProductCreateSuccess, (state, { product }) => ({
    ...state, saving: false, selected: product,
  })),

  // update
  on(A.adminProductUpdateSuccess, (state, { product }) => ({
    ...state, saving: false, selected: product,
    page: state.page
      ? { ...state.page, content: state.page.content.map(p => p.id === product.id ? product : p) }
      : state.page,
  })),

  // delete
  on(A.adminProductDeleteSuccess, (state, { id }) => ({
    ...state, saving: false,
    page: state.page
      ? { ...state.page, content: state.page.content.filter(p => p.id !== id), totalElements: state.page.totalElements - 1 }
      : state.page,
  })),

  // attribs
  on(A.adminProductsLoadAttribsSuccess, (state, { attribs }) => ({
    ...state, attribs,
  })),

  // error
  on(A.adminProductsFailure, (state, { error }) => ({
    ...state, loading: false, saving: false, error,
  })),
);
