import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsLogged } from '../store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  //Get token user
  const isLogged$ = toSignal(store.select(selectIsLogged));

  //CheckStatus
  if (!isLogged$()) router.navigate(['/login']);
  return true;
};
