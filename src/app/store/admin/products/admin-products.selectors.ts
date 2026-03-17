import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminProductState } from './admin-products.state';

export const selectAdminProductsState = createFeatureSelector<AdminProductState>('adminProducts');

export const selectAdminProductsPage    = createSelector(selectAdminProductsState, s => s.page);
export const selectAdminProductsList    = createSelector(selectAdminProductsState, s => s.page?.content ?? []);
export const selectAdminProductsTotal   = createSelector(selectAdminProductsState, s => s.page?.totalElements ?? 0);
export const selectAdminProductSelected = createSelector(selectAdminProductsState, s => s.selected);
export const selectAdminProductAttribs  = createSelector(selectAdminProductsState, s => s.attribs);
export const selectAdminProductLoading  = createSelector(selectAdminProductsState, s => s.loading);
export const selectAdminProductSaving   = createSelector(selectAdminProductsState, s => s.saving);
export const selectAdminProductError    = createSelector(selectAdminProductsState, s => s.error);
