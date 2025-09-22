import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginRequestInit, loginSuccessFinal } from './auth.actions';
import { exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service';
import { LoginTokenResponse } from '../../type/types';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);

  loginRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequestInit),
      exhaustMap((action) =>
        this.authService.login(action.username, action.password).pipe(
          // tap((res) => console.log('Respuesta del backend:', res)),
          map((loginTokenResponse: LoginTokenResponse) =>
            loginSuccessFinal({ loginTokenResponse })
          )
        )
      )
    )
  );
}
