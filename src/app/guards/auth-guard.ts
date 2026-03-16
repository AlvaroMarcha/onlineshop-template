import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsTokenValid } from '../store/auth/auth.selectors';
import { logout } from '../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isValid = toSignal(store.select(selectIsTokenValid));

  if (!isValid()) {
    // Token ausente o expirado — limpiar store y redirigir
    store.dispatch(logout());
    router.navigate(['/login']);
    return false;
  }
  return true;
};
