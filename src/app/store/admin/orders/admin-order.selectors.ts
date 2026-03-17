import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminOrderState } from './admin-order.state';

export const selectAdminOrder = createFeatureSelector<AdminOrderState>('orders');

export const selectAdminOrders = createSelector(
  selectAdminOrder,
  (state) => state.orders
);

export const selectAdminOrderSelected = createSelector(
  selectAdminOrder,
  (state) => state.selected
);

export const selectAdminOrderSearchParams = createSelector(
  selectAdminOrder,
  (state) => state.searchParams
);

export const selectAdminOrderLoading = createSelector(
  selectAdminOrder,
  (state) => state.loading
);

export const selectAdminOrderDetailLoading = createSelector(
  selectAdminOrder,
  (state) => state.detailLoading
);

export const selectAdminOrderSaving = createSelector(
  selectAdminOrder,
  (state) => state.saving
);

export const selectAdminOrderError = createSelector(
  selectAdminOrder,
  (state) => state.error
);
