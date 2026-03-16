import { Component, effect, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormArray,
  FormControl,
} from '@angular/forms';
import { createClientUser, Terms } from '../../type/types';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { registerRequest } from '../../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from '../../store/auth/auth.selectors';
import { MCard } from '../marcha/m-card/m-card';
import { MInput } from '../marcha/m-input/m-input';
import { MPassword } from '../marcha/m-password/m-password';
import { MButton } from '../marcha/m-button/m-button';
import { MMessage } from '../marcha/m-message/m-message';
import { MCheckbox } from '../marcha/m-checkbox/m-checkbox';

export function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-card',
  imports: [ReactiveFormsModule, TranslateModule, MCard, MInput, MPassword, MButton, MMessage, MCheckbox],
  templateUrl: './registerCard.html',
  styleUrl: './registerCard.css',
})
export class RegisterCard {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  public router = inject(Router);

  registerForm = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [0, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      termsList: this.fb.nonNullable.array([
        this.fb.nonNullable.control(false),
        this.fb.nonNullable.control(false),
      ]),
    },
    { validators: passwordsMatchValidator }
  );

  loading = false;
  termsError = false;

  legal: Terms[] = [
    { name: 'Terms', value: false, label: 'register.form.terms' },
    { name: 'Privacy', value: false, label: 'register.form.privacy_policy' },
  ];

  constructor() {
    const user$ = toSignal(this.store.select(selectUser));
    effect(() => {
      const user = user$();
      if (user) {
        if (user.roleName === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  onRegister(): void {
    this.termsError = false;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const termsList = (this.registerForm.get('termsList') as FormArray<FormControl<boolean>>).value;
    if (!termsList.every((v) => v)) {
      this.termsError = true;
      return;
    }
    const { name, surnames, username, email, phone, password } =
      this.registerForm.getRawValue();
    const payload: createClientUser = {
      client: {
        id: null,
        first_name: name,
        last_name: surnames,
        email,
        phone,
      },
      user: {
        id: null,
        name,
        username,
        password,
        email,
        phone,
        status: true,
        locked: false,
        created_at: new Date().toISOString(),
      },
      role: { id: 4 },
    };
    this.loading = true;
    this.store.dispatch(registerRequest({ payload }));
  }
}
