import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminUsersState } from './admin-users.state';

export const selectAdminUsers = createFeatureSelector<AdminUsersState>('adminUsers');

export const selectAdminUsersPage = createSelector(
  selectAdminUsers,
  (state) => state.users
);

export const selectAdminUserSelected = createSelector(
  selectAdminUsers,
  (state) => state.selected
);

export const selectAdminUsersSearchParams = createSelector(
  selectAdminUsers,
  (state) => state.searchParams
);

export const selectAdminUsersLoading = createSelector(
  selectAdminUsers,
  (state) => state.loading
);

export const selectAdminUsersDetailLoading = createSelector(
  selectAdminUsers,
  (state) => state.detailLoading
);

export const selectAdminUsersSaving = createSelector(
  selectAdminUsers,
  (state) => state.saving
);

export const selectAdminUsersError = createSelector(
  selectAdminUsers,
  (state) => state.error
);
