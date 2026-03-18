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
  // toggle: actualización optimista — invierte active de inmediato, el servidor confirma
  on(A.adminCategoryToggle, (state, { id }) => ({
    ...state, toggling: true, error: null,
    categories: state.categories.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    ),
  })),
  on(A.adminSubcategoryToggle, (state, { categoryId, id }) => ({
    ...state, toggling: true, error: null,
    categories: state.categories.map(c =>
      c.id === categoryId
        ? { ...c, subcategories: c.subcategories.map(s => s.id === id ? { ...s, active: !s.active } : s) }
        : c
    ),
  })),


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

  // category toggle
  on(A.adminCategoryToggleSuccess, (state, { category }) => ({
    ...state, toggling: false,
    categories: state.categories.map(c => c.id === category.id ? category : c),
  })),

  // subcategory toggle
  on(A.adminSubcategoryToggleSuccess, (state, { categoryId, subcategory }) => ({
    ...state, toggling: false,
    categories: state.categories.map(c =>
      c.id === categoryId
        ? { ...c, subcategories: c.subcategories.map(s => s.id === subcategory.id ? subcategory : s) }
        : c
    ),
  })),

  // error
  on(A.adminCatalogFailure, (state, { error }) => ({
    ...state, loading: false, saving: false, toggling: false, error,
  })),
);
