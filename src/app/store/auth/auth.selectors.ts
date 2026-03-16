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

// Verifica que el token existe y no ha expirado (decodifica el payload JWT)
export const selectIsTokenValid = createSelector(selectToken, (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
});
