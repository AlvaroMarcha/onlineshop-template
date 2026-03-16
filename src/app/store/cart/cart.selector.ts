import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCart = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCart,
  (state) => state.items
);

export const selectCartTotal = createSelector(
  selectCart,
  (state) => state.total
);

export const selectCartCount = createSelector(selectCart, (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);
