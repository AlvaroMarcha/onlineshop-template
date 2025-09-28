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

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

//IsLogged user ???
export const selectIsLogged = createSelector(selectToken, (token) => !!token);
