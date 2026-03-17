import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminProductService } from '../../../services/admin/admin-product.service';
import * as A from './admin-products.actions';

@Injectable()
export class AdminProductEffects {
  private actions$ = inject(Actions);
  private svc      = inject(AdminProductService);

  search$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductsSearch),
    switchMap(({ params }) => this.svc.searchProducts(params).pipe(
      map(page => A.adminProductsSearchSuccess({ page })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  load$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductLoad),
    switchMap(({ id }) => this.svc.getProductById(id).pipe(
      map(product => A.adminProductLoadSuccess({ product })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  create$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductCreate),
    switchMap(({ payload }) => this.svc.createProduct(payload).pipe(
      map(product => A.adminProductCreateSuccess({ product })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  update$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductUpdate),
    switchMap(({ id, payload }) => this.svc.updateProduct(id, payload).pipe(
      map(product => A.adminProductUpdateSuccess({ product })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductDelete),
    switchMap(({ id }) => this.svc.deleteProduct(id).pipe(
      map(() => A.adminProductDeleteSuccess({ id })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadAttribs$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminProductsLoadAttribs),
    switchMap(() => this.svc.getAttribs().pipe(
      map(attribs => A.adminProductsLoadAttribsSuccess({ attribs })),
      catchError(err => of(A.adminProductsFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));
}
