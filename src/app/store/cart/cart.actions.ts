import { createAction, props } from '@ngrx/store';
import { ProductCartItem } from '../../type/types';

export const addToCart = createAction(
  '[Cart] Add Item action',
  props<{ item: ProductCartItem }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item action',
  props<{ id: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart action');

export const updateQuantity = createAction(
  '[Cart] Update Quantity action',
  props<{ id: number; quantity: number }>()
);
