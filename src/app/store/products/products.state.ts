import { Product } from '../../type/types';

export interface ProductsState {
  products: Product[];
  error: string | null;
}

export const initialState: ProductsState = {
  products: localStorage.getItem('products')
    ? (JSON.parse(localStorage.getItem('products')!) as Product[])
    : [],
  error: null,
};
