import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth-service';
import { loginRequest, loginSuccess, loginFailure } from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequest),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response: { user: any; token: string }) =>
            loginSuccess({ user: response.user, token: response.token })
          ),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );
}
