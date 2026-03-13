import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterCard, passwordsMatchValidator } from './registerCard';
import { registerRequest } from '../../store/auth/auth.actions';

describe('passwordsMatchValidator', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should return null when passwords match', () => {
    const group = fb.group(
      { password: ['abc123'], confirmPassword: ['abc123'] },
      { validators: passwordsMatchValidator }
    );
    expect(passwordsMatchValidator(group)).toBeNull();
  });

  it('should return { passwordsMismatch: true } when passwords differ', () => {
    const group = fb.group(
      { password: ['abc123'], confirmPassword: ['different'] },
      { validators: passwordsMatchValidator }
    );
    expect(passwordsMatchValidator(group)).toEqual({ passwordsMismatch: true });
  });
});

describe('RegisterCard', () => {
  let component: RegisterCard;
  let store: MockStore;

  const initialState = {
    auth: { token: null, user: null, loading: false, error: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCard, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    const fixture = TestBed.createComponent(RegisterCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('registerForm should be invalid when empty', () => {
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('onRegister() should mark form as touched when form is invalid', () => {
    spyOn(component.registerForm, 'markAllAsTouched');
    component.onRegister();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('onRegister() should set termsError when form valid but terms not accepted', () => {
    component.registerForm.setValue({
      name: 'John',
      surnames: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: 612345678,
      password: 'secret123',
      confirmPassword: 'secret123',
      termsList: [false, false],
    });
    component.onRegister();
    expect(component.termsError).toBeTrue();
  });

  it('onRegister() should dispatch registerRequest when form valid and terms accepted', () => {
    spyOn(store, 'dispatch');
    component.registerForm.setValue({
      name: 'John',
      surnames: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: 612345678,
      password: 'secret123',
      confirmPassword: 'secret123',
      termsList: [true, true],
    });
    component.onRegister();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
