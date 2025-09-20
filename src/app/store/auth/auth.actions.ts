import { createAction, props } from '@ngrx/store';
import { User } from '../../type/types';

// Acción para disparar el login (con credenciales)
export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ username: string; password: string }>()
);

// Acción cuando el backend responde OK
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

// Acción cuando hay error
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
