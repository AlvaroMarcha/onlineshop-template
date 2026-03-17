import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsTokenValid, selectUser } from '../store/auth/auth.selectors';
import { logout } from '../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';

const ADMIN_ROLES = [
  'ROLE_ADMIN',
  'ROLE_SUPER_ADMIN',
  'ROLE_STORE',
  'ROLE_ORDERS',
  'ROLE_CUSTOMERS_INVOICES',
  'ROLE_SUPPORT',
];

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isValid = toSignal(store.select(selectIsTokenValid));
  const user    = toSignal(store.select(selectUser));

  if (!isValid()) {
    store.dispatch(logout());
    router.navigate(['/login']);
    return false;
  }

  if (!user() || !ADMIN_ROLES.includes(user()!.roleName)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
