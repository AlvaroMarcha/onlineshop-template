import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequestInit } from '../../store/auth/auth.actions';
import { selectAuthError, selectUser } from '../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MCard } from '../marcha/m-card/m-card';
import { MInput } from '../marcha/m-input/m-input';
import { MPassword } from '../marcha/m-password/m-password';
import { MButton } from '../marcha/m-button/m-button';
import { MMessage } from '../marcha/m-message/m-message';

@Component({
  selector: 'app-loginCard',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MCard, MInput, MPassword, MButton, MMessage],
  templateUrl: './loginCard.html',
  styleUrl: './loginCard.css',
})
export class LoginCard {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  public router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  errorMessage$ = toSignal(this.store.select(selectAuthError));

  constructor() {
    const user$ = toSignal(this.store.select(selectUser));

    effect(() => {
      const user = user$();
      if (user) {
        // Backend devuelve roleName como string: "ADMIN" o "USER"
        if (user.roleName === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.getRawValue();
    this.loading = true;
    // El backend acepta username O email en el campo 'usernameOrEmail'
    this.store.dispatch(loginRequestInit({ username, password }));
    this.loading = false;
  }
}

