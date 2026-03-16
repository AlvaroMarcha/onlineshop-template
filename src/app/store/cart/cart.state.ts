import { ProductCartItem } from '../../type/types';

export interface CartState {
  items: ProductCartItem[];
  total: number;
}

export const initialState: CartState = {
  items: [],
  total: 0,
};
