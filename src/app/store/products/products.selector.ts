import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

export const selectProductsState =
  createFeatureSelector<ProductsState>('products');

//Create select to get all products
export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

//Create select to get product by id
export const selectProductById = (id: number) =>
  createSelector(selectProductsState, (state) =>
    state.products.find((product) => product.id === id)
  );
