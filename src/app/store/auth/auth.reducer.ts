import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import {
  loginFailure,
  loginRequestFinal,
  loginSuccessFinal,
  logout,
  registerRequest,
  registerSuccess,
  updateProfileImageUrl,
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
    console.log('🔵 Backend response:', JSON.stringify(loginTokenResponse, null, 2));
    console.log('🔵 User object:', loginTokenResponse.user);
    console.log('🔵 User active field:', loginTokenResponse.user.active);
    console.log('🔵 User verified field:', loginTokenResponse.user.verified);
    
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

  // Register success
  on(registerSuccess, (state, { loginTokenResponse }) => {
    // Guardar token, refreshToken y user en localStorage
    localStorage.setItem('token', loginTokenResponse.token);
    localStorage.setItem('refreshToken', loginTokenResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(loginTokenResponse.user));
    return {
      ...state,
      token: loginTokenResponse.token,
      refreshToken: loginTokenResponse.refreshToken,
      user: loginTokenResponse.user,
      loading: false,
      error: null,
    };
  }),

  // Update profile image URL
  on(updateProfileImageUrl, (state, { profileImageUrl }) => {
    if (!state.user) return state;
    
    const updatedUser = { ...state.user, profileImageUrl };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      ...state,
      user: updatedUser,
    };
  })
);
