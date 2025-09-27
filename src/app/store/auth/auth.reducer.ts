import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import {
  loginRequestFinal,
  loginSuccessFinal,
  logout,
  registerRequest,
  registerSuccess,
} from './auth.actions';
import { state } from '@angular/animations';

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
    localStorage.setItem('token', loginTokenResponse.token);
    localStorage.setItem('user', JSON.stringify(loginTokenResponse.user));
    return {
      ...state,
      token: loginTokenResponse.token,
      user: loginTokenResponse.user,
    };
  }),

  //Logout
  on(logout, (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { ...state, token: null, user: null };
  }),

  // Register request
  on(registerRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Register success
  on(registerSuccess, (state, { user, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      token,
      user,
      loading: false,
    };
  })
);
