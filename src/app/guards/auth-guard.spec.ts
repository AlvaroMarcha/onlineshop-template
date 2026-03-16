import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authGuard } from './auth-guard';
import { selectIsTokenValid } from '../store/auth/auth.selectors';
import { logout } from '../store/auth/auth.actions';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Genera un JWT con el exp dado (en segundos desde epoch)
function makeToken(expSeconds: number): string {
  const payload = btoa(JSON.stringify({ exp: expSeconds }));
  return `header.${payload}.signature`;
}

describe('authGuard', () => {
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
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

  it('should return true when token is valid', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    store.overrideSelector(selectIsTokenValid, true);
    store.setState({ auth: { token: makeToken(futureExp), user: null, loading: false, error: null } });

    const result = runGuard();
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login and return false when token is absent', () => {
    store.overrideSelector(selectIsTokenValid, false);
    store.setState({ auth: { token: null, user: null, loading: false, error: null } });

    const result = runGuard();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should dispatch logout when token is expired', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.overrideSelector(selectIsTokenValid, false);
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    store.setState({ auth: { token: makeToken(pastExp), user: null, loading: false, error: null } });

    runGuard();
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
  });
});
