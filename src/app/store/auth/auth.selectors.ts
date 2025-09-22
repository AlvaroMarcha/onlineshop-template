import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Create select to get Token
export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

//Create select to get User
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

//Create select to get loading state
// export const selectLoading = createSelector(
//   selectAuthState,
//   (state) => state.loading
// );

//Create select to get error state
// export const selectError = createSelector(
//   selectAuthState,
//   (state) => state.error
// );
