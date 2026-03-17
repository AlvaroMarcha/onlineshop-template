import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminUsersService } from '../../../services/admin/admin-users.service';
import * as A from './admin-users.actions';

@Injectable()
export class AdminUsersEffects {
  private actions$ = inject(Actions);
  private svc      = inject(AdminUsersService);

  // ── Listado ──────────────────────────────────────────────────────────────────

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminUsersLoad),
    switchMap(({ params }) => this.svc.getUsersForAdmin(params).pipe(
      map(page => A.adminUsersLoadSuccess({ page })),
      catchError(err => of(A.adminUsersFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Detalle ──────────────────────────────────────────────────────────────────

  loadUser$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminUserLoad),
    switchMap(({ id }) => this.svc.getUserById(id).pipe(
      map(user => A.adminUserLoadSuccess({ user })),
      catchError(err => of(A.adminUsersFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Ban ───────────────────────────────────────────────────────────────────────

  banUser$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminUserBan),
    switchMap(({ id }) => this.svc.banUser(id).pipe(
      map(result => A.adminUserBanSuccess({ result })),
      catchError(err => of(A.adminUsersFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Unban ─────────────────────────────────────────────────────────────────────

  unbanUser$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminUserUnban),
    switchMap(({ id }) => this.svc.unbanUser(id).pipe(
      map(result => A.adminUserUnbanSuccess({ result })),
      catchError(err => of(A.adminUsersFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));
}
