import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // cuando empieza el login → podrías poner loading en true
  on(loginRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // login correcto → guardamos user y token
  on(loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
  })),

  // login falla → guardamos error
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // logout → limpiamos estado
  on(logout, () => initialAuthState)
);
