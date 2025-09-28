import { createReducer, on } from '@ngrx/store';
import { initialState } from './products.state';
import {
  allProductsSuccessFinal,
  getProductFailure,
  productByIdRequestFinal,
} from './products.actions';

export const productReducer = createReducer(
  initialState,
  //getAllProducts
  on(allProductsSuccessFinal, (state, { products }) => ({
    ...state,
    products,
  })),

  //getProductById
  on(productByIdRequestFinal, (state, { id }) => ({
    ...state,
    id,
  })),

  //Product failure
  on(getProductFailure, (state, { error }) => ({
    ...state,
    error: 'Something gone wrong - 0 products found',
  }))
);
