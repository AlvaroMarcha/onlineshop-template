import { createAction, props } from '@ngrx/store';
import { Product } from '../../type/types';

//Request All products
export const allProductsRequestInit = createAction(
  '[Products] All Products init action'
);

export const allProductsSuccessFinal = createAction(
  '[Products] All Products final action',
  props<{ products: Product[] }>()
);

//Request product by ID
export const productByIdRequestInit = createAction(
  '[Products] Get Product init action',
  props<{ id: number }>()
);

export const productByIdRequestFinal = createAction(
  '[Products] Get Product final action',
  props<{ id: number }>()
);

//Error products
export const getProductFailure = createAction(
  '[Products] Products Failure action',
  props<{ error: string }>()
);
