import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { loginRequestFinal, loginSuccessFinal, logout } from './auth.actions';
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
    return {
      ...state,
      token: loginTokenResponse.token,
      user: loginTokenResponse.user,
    };
  }),

  //Logout
  on(logout, (state) => {
    localStorage.removeItem('token');
    return { ...state, token: null, user: null };
  })
);
