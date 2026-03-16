import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loginFailure,
  loginRequestInit,
  loginSuccessFinal,
  registerRequest,
  registerSuccess,
} from './auth.actions';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service';
import { LoginTokenResponse } from '../../type/types';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);

  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequestInit),
      exhaustMap((action) =>
        // El backend acepta username O email en 'usernameOrEmail'
        this.authService.login(action.username, action.password).pipe(
          map((loginTokenResponse: LoginTokenResponse) =>
            loginSuccessFinal({ loginTokenResponse })
          ),
          catchError((error) => {
            const errorMsg = error?.error?.message || error?.message || 'Error al iniciar sesión';
            return of(loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerRequest),
      mergeMap(({ payload }) =>
        this.authService.register(payload).pipe(
          map((loginTokenResponse: LoginTokenResponse) =>
            registerSuccess({ loginTokenResponse })
          ),
          catchError((error) => {
            const errorMsg = error?.error?.message || error?.message || 'Error al registrar usuario';
            return of(loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
}
