import { createReducer, on } from '@ngrx/store';
import { initialState } from './cart.state';
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from './cart.actions';

export const productCartReducer = createReducer(
  initialState,
  on(addToCart, (state, { item }) => {
    const existing = state.items?.find((i) => i.id === item.id);
    let updatedItems;

    if (existing) {
      updatedItems = state.items?.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      updatedItems = [...state.items, item];
    }

    return {
      ...state,
      items: updatedItems,
      total: updatedItems?.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
  }),

  on(removeFromCart, (state, { id }) => {
    const updatedItems = state.items?.filter((i) => i.id !== id);
    return {
      ...state,
      items: updatedItems,
      total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
  }),

  on(updateQuantity, (state, { id, quantity }) => {
    const updatedItems = state.items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    return {
      ...state,
      items: updatedItems,
      total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
  }),

  on(clearCart, (state) => ({
    ...state,
    items: [],
    total: 0,
  }))
);
