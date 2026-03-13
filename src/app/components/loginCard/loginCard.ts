import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequestInit } from '../../store/auth/auth.actions';
import { selectAuthError, selectUser } from '../../store/auth/auth.selectors';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-loginCard',
  standalone: true,
  imports: [ReactiveFormsModule, PrimengModule, TranslateModule],
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
        if (user.role_id === 1) {
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
    this.store.dispatch(loginRequestInit({ username, password }));
    this.loading = false;
  }
}

