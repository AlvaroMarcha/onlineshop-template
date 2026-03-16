import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import {
  loginFailure,
  loginRequestFinal,
  loginSuccessFinal,
  logout,
  registerRequest,
  registerSuccess,
} from './auth.actions';

export const authReducer = createReducer(
  initialState,
  //Login request from Effect
  on(loginRequestFinal, (state, { username, password }) => ({
    ...state,
    username,
    password,
  })),

  //Login successs from Effect
  on(loginSuccessFinal, (state, { loginTokenResponse }) => {
    // Guardar token, refreshToken y user en localStorage
    localStorage.setItem('token', loginTokenResponse.token);
    localStorage.setItem('refreshToken', loginTokenResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(loginTokenResponse.user));
    return {
      ...state,
      token: loginTokenResponse.token,
      refreshToken: loginTokenResponse.refreshToken,
      user: loginTokenResponse.user,
      error: null,  // Limpiar error en login exitoso
    };
  }),

  //Login failure
  on(loginFailure, (state, { error }) => ({
    ...state,
    error: 'Credenciales incorrectas',
  })),

  //Logout
  on(logout, (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return { ...state, token: null, refreshToken: null, user: null, error: null };
  }),

  // Register request
  on(registerRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Register success (TODO: adaptar para incluir refreshToken cuando se actualice register)
  on(registerSuccess, (state, { user, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      token,
      user,
      loading: false,
      error: null,
    };
  })
);
