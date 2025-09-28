import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductServices } from '../../services/product-services';
import {
  allProductsSuccessFinal,
  allProductsRequestInit,
  getProductFailure,
} from './products.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Product } from '../../type/types';

@Injectable()
export class ProductEffects {
  actions$ = inject(Actions);
  productsService = inject(ProductServices);

  getAllProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(allProductsRequestInit),
      exhaustMap(() =>
        this.productsService.getAllProducts().pipe(
          map((products: Product[]) => allProductsSuccessFinal({ products })),
          catchError((error) => of(getProductFailure({ error })))
        )
      )
    )
  );
}
