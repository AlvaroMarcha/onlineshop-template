import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { adminGuard } from './admin-guard';
import { selectIsTokenValid, selectUser } from '../store/auth/auth.selectors';
import { logout } from '../store/auth/auth.actions';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../type/types';

function makeUser(roleName: string): User {
  return {
    id: 1, name: 'Admin', surname: 'Test', username: 'admin',
    email: 'admin@test.com', phone: '600000000', roleName,
    profileImageUrl: '', createdAt: new Date().toISOString(),
    active: true, verified: true, addresses: [],
  };
}

describe('adminGuard', () => {
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: Router, useValue: router },
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('should redirect to /login and return false when token is invalid', () => {
    store.overrideSelector(selectIsTokenValid, false);
    store.overrideSelector(selectUser, null);
    const dispatchSpy = spyOn(store, 'dispatch');

    const result = runGuard();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
  });

  it('should redirect to / and return false when user has ROLE_USER', () => {
    store.overrideSelector(selectIsTokenValid, true);
    store.overrideSelector(selectUser, makeUser('ROLE_USER'));

    const result = runGuard();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access for ROLE_ADMIN', () => {
    store.overrideSelector(selectIsTokenValid, true);
    store.overrideSelector(selectUser, makeUser('ROLE_ADMIN'));

    const result = runGuard();

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should allow access for ROLE_SUPER_ADMIN', () => {
    store.overrideSelector(selectIsTokenValid, true);
    store.overrideSelector(selectUser, makeUser('ROLE_SUPER_ADMIN'));

    const result = runGuard();

    expect(result).toBeTrue();
  });

  it('should allow access for ROLE_STORE', () => {
    store.overrideSelector(selectIsTokenValid, true);
    store.overrideSelector(selectUser, makeUser('ROLE_STORE'));

    const result = runGuard();

    expect(result).toBeTrue();
  });

  it('should allow access for ROLE_SUPPORT', () => {
    store.overrideSelector(selectIsTokenValid, true);
    store.overrideSelector(selectUser, makeUser('ROLE_SUPPORT'));

    const result = runGuard();

    expect(result).toBeTrue();
  });
});
