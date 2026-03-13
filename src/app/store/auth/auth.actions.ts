import { createAction, props } from '@ngrx/store';
import { createClientUser, LoginTokenResponse, User } from '../../type/types';

// Login request init action
export const loginRequestInit = createAction(
  '[Auth] Login Request init action',
  props<{ username: string; password: string }>()
);

// Login request final action
export const loginRequestFinal = createAction(
  '[Auth] Login Request final action',
  props<{ username: string; password: string }>()
);

//Login success init action
export const loginSuccess = createAction(
  '[Auth] Login Success init action',
  props<{ loginTokenResponse: LoginTokenResponse }>()
);

//Login success final action
export const loginSuccessFinal = createAction(
  '[Auth] Login Success final action',
  props<{ loginTokenResponse: LoginTokenResponse }>()
);

//Login failure action
export const loginFailure = createAction(
  '[Auth] Login Failure action',
  props<{ error: string }>()
);

//Login logout action
export const logout = createAction('[Auth] Logout action');

//Register request
export const registerRequest = createAction(
  '[Auth] Register Request',
  props<{ payload: createClientUser }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);
