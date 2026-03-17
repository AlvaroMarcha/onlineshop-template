import { createAction, props } from '@ngrx/store';
import {
  BannedUserResponse,
  Page,
  UserAdmin,
  UserSearchParams,
} from '../../../type/admin-types';

// ── Listado ───────────────────────────────────────────────────────────────────

export const adminUsersLoad = createAction(
  '[AdminUsers] Load Users',
  props<{ params: UserSearchParams }>()
);

export const adminUsersLoadSuccess = createAction(
  '[AdminUsers] Load Users Success',
  props<{ page: Page<UserAdmin> }>()
);

export const adminUsersSetPage = createAction(
  '[AdminUsers] Set Page',
  props<{ page: number; size: number }>()
);

// ── Detalle ───────────────────────────────────────────────────────────────────

export const adminUserLoad = createAction(
  '[AdminUsers] Load User',
  props<{ id: number }>()
);

export const adminUserLoadSuccess = createAction(
  '[AdminUsers] Load User Success',
  props<{ user: UserAdmin }>()
);

// ── Ban / unban ───────────────────────────────────────────────────────────────

export const adminUserBan = createAction(
  '[AdminUsers] Ban User',
  props<{ id: number }>()
);

export const adminUserBanSuccess = createAction(
  '[AdminUsers] Ban User Success',
  props<{ result: BannedUserResponse }>()
);

export const adminUserUnban = createAction(
  '[AdminUsers] Unban User',
  props<{ id: number }>()
);

export const adminUserUnbanSuccess = createAction(
  '[AdminUsers] Unban User Success',
  props<{ result: BannedUserResponse }>()
);

// ── Error ─────────────────────────────────────────────────────────────────────

export const adminUsersFailure = createAction(
  '[AdminUsers] Failure',
  props<{ error: string }>()
);
