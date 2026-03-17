import { createReducer, on } from '@ngrx/store';
import { initialAdminCatalogState } from './admin-catalog.state';
import * as A from './admin-catalog.actions';

export const adminCatalogReducer = createReducer(
  initialAdminCatalogState,

  // loading
  on(A.adminCatalogLoad, (state) => ({ ...state, loading: true, error: null })),
  on(A.adminCategoryCreate,
     A.adminCategoryUpdate,
     A.adminCategoryDelete,
     A.adminSubcategoryCreate,
     A.adminSubcategoryUpdate,
     A.adminSubcategoryDelete,
     (state) => ({ ...state, saving: true, error: null })
  ),

  // load success
  on(A.adminCatalogLoadSuccess, (state, { categories }) => ({
    ...state, loading: false, categories,
  })),

  // category create
  on(A.adminCategoryCreateSuccess, (state, { category }) => ({
    ...state, saving: false, categories: [...state.categories, category],
  })),

  // category update
  on(A.adminCategoryUpdateSuccess, (state, { category }) => ({
    ...state, saving: false,
    categories: state.categories.map(c => c.id === category.id ? category : c),
  })),

  // category delete
  on(A.adminCategoryDeleteSuccess, (state, { id }) => ({
    ...state, saving: false,
    categories: state.categories.filter(c => c.id !== id),
  })),

  // subcategory create
  on(A.adminSubcategoryCreateSuccess, (state, { categoryId, subcategory }) => ({
    ...state, saving: false,
    categories: state.categories.map(c =>
      c.id === categoryId
        ? { ...c, subcategories: [...c.subcategories, subcategory] }
        : c
    ),
  })),

  // subcategory update
  on(A.adminSubcategoryUpdateSuccess, (state, { categoryId, subcategory }) => ({
    ...state, saving: false,
    categories: state.categories.map(c =>
      c.id === categoryId
        ? { ...c, subcategories: c.subcategories.map(s => s.id === subcategory.id ? subcategory : s) }
        : c
    ),
  })),

  // subcategory delete
  on(A.adminSubcategoryDeleteSuccess, (state, { categoryId, id }) => ({
    ...state, saving: false,
    categories: state.categories.map(c =>
      c.id === categoryId
        ? { ...c, subcategories: c.subcategories.filter(s => s.id !== id) }
        : c
    ),
  })),

  // error
  on(A.adminCatalogFailure, (state, { error }) => ({
    ...state, loading: false, saving: false, error,
  })),
);
