import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginCard } from './loginCard';
import { loginRequestInit } from '../../store/auth/auth.actions';

describe('LoginCard', () => {
  let component: LoginCard;
  let store: MockStore;

  const initialState = {
    auth: { token: null, user: null, loading: false, error: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCard, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    const fixture = TestBed.createComponent(LoginCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('loginForm should be invalid when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('loginForm should be valid when username and password are provided', () => {
    component.loginForm.setValue({ username: 'testuser', password: 'testpass' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('onLogin() should mark form as touched when form is invalid', () => {
    spyOn(component.loginForm, 'markAllAsTouched');
    component.onLogin();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('onLogin() should dispatch loginRequestInit when form is valid', () => {
    spyOn(store, 'dispatch');
    component.loginForm.setValue({ username: 'testuser', password: 'testpass' });
    component.onLogin();
    expect(store.dispatch).toHaveBeenCalledWith(
      loginRequestInit({ username: 'testuser', password: 'testpass' })
    );
  });
});
