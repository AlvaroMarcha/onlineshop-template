import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminCatalogState } from './admin-catalog.state';

export const selectAdminCatalog = createFeatureSelector<AdminCatalogState>('catalog');

export const selectAdminCatalogCategories = createSelector(
  selectAdminCatalog,
  (state) => state.categories
);

export const selectAdminCatalogLoading = createSelector(
  selectAdminCatalog,
  (state) => state.loading
);

export const selectAdminCatalogSaving = createSelector(
  selectAdminCatalog,
  (state) => state.saving
);

export const selectAdminCatalogError = createSelector(
  selectAdminCatalog,
  (state) => state.error
);
