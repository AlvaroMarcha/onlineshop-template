import { createReducer, on } from '@ngrx/store';
import { AdminUsersState, initialAdminUsersState } from './admin-users.state';
import * as A from './admin-users.actions';

export const adminUsersReducer = createReducer<AdminUsersState>(
  initialAdminUsersState,

  // ── Listado ─────────────────────────────────────────────────────────────────

  on(A.adminUsersLoad, (state) => ({
    ...state,
    loading: true,
    error:   null,
  })),

  on(A.adminUsersLoadSuccess, (state, { page }) => ({
    ...state,
    users:   page,
    loading: false,
  })),

  on(A.adminUsersSetPage, (state, { page, size }) => ({
    ...state,
    searchParams: { ...state.searchParams, page, size },
  })),

  // ── Detalle ─────────────────────────────────────────────────────────────────

  on(A.adminUserLoad, (state) => ({
    ...state,
    detailLoading: true,
    error:         null,
  })),

  on(A.adminUserLoadSuccess, (state, { user }) => ({
    ...state,
    selected:      user,
    detailLoading: false,
  })),

  // ── Ban / unban ──────────────────────────────────────────────────────────────

  on(A.adminUserBan, A.adminUserUnban, (state) => ({
    ...state,
    saving: true,
    error:  null,
  })),

  on(A.adminUserBanSuccess, (state, { result }) => ({
    ...state,
    saving:   false,
    selected: state.selected?.id === result.userId
      ? { ...state.selected, isBanned: result.banned }
      : state.selected,
    users: state.users
      ? {
          ...state.users,
          content: state.users.content.map((u) =>
            u.id === result.userId ? { ...u, isBanned: result.banned } : u
          ),
        }
      : null,
  })),

  on(A.adminUserUnbanSuccess, (state, { result }) => ({
    ...state,
    saving:   false,
    selected: state.selected?.id === result.userId
      ? { ...state.selected, isBanned: result.banned }
      : state.selected,
    users: state.users
      ? {
          ...state.users,
          content: state.users.content.map((u) =>
            u.id === result.userId ? { ...u, isBanned: result.banned } : u
          ),
        }
      : null,
  })),

  // ── Error ────────────────────────────────────────────────────────────────────

  on(A.adminUsersFailure, (state, { error }) => ({
    ...state,
    loading:       false,
    detailLoading: false,
    saving:        false,
    error,
  }))
);
