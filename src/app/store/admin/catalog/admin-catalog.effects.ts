import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminCatalogService } from '../../../services/admin/admin-catalog.service';
import * as A from './admin-catalog.actions';

@Injectable()
export class AdminCatalogEffects {
  private actions$ = inject(Actions);
  private svc      = inject(AdminCatalogService);

  load$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminCatalogLoad),
    switchMap(() => this.svc.getCategories().pipe(
      map(categories => A.adminCatalogLoadSuccess({ categories })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  categoryCreate$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminCategoryCreate),
    switchMap(({ payload }) => this.svc.createCategory(payload).pipe(
      map(category => A.adminCategoryCreateSuccess({ category })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  categoryUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminCategoryUpdate),
    switchMap(({ id, payload }) => this.svc.updateCategory(id, payload).pipe(
      map(category => A.adminCategoryUpdateSuccess({ category })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  categoryDelete$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminCategoryDelete),
    switchMap(({ id }) => this.svc.deleteCategory(id).pipe(
      map(() => A.adminCategoryDeleteSuccess({ id })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  subcategoryCreate$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminSubcategoryCreate),
    switchMap(({ payload }) => this.svc.createSubcategory(payload).pipe(
      map(subcategory => A.adminSubcategoryCreateSuccess({ categoryId: payload.categoryId, subcategory })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  subcategoryUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminSubcategoryUpdate),
    switchMap(({ categoryId, id, payload }) => this.svc.updateSubcategory(id, payload).pipe(
      map(subcategory => A.adminSubcategoryUpdateSuccess({ categoryId, subcategory })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  subcategoryDelete$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminSubcategoryDelete),
    switchMap(({ categoryId, id }) => this.svc.deleteSubcategory(id).pipe(
      map(() => A.adminSubcategoryDeleteSuccess({ categoryId, id })),
      catchError(err => of(A.adminCatalogFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  categoryToggle$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminCategoryToggle),
    switchMap(({ id }) => this.svc.toggleCategory(id).pipe(
      map(category => A.adminCategoryToggleSuccess({ category })),
      catchError(err => of(
        A.adminCatalogFailure({ error: err?.error?.message ?? err.message }),
        A.adminCatalogLoad()  // revierte el update optimista
      ))
    ))
  ));

  subcategoryToggle$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminSubcategoryToggle),
    switchMap(({ categoryId, id }) => this.svc.toggleSubcategory(id).pipe(
      map(subcategory => A.adminSubcategoryToggleSuccess({ categoryId, subcategory })),
      catchError(err => of(
        A.adminCatalogFailure({ error: err?.error?.message ?? err.message }),
        A.adminCatalogLoad()  // revierte el update optimista
      ))
    ))
  ));
}
