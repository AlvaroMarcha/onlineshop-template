import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequestInit, logout } from '../../store/auth/auth.actions';
import {
  selectAuthError,
  selectIsLogged,
  selectToken,
  selectUser,
} from '../../store/auth/auth.selectors';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../type/types';

@Component({
  selector: 'app-loginCard',
  standalone: true,
  imports: [FormsModule, PrimengModule, TranslateModule],
  templateUrl: './loginCard.html',
  styleUrl: './loginCard.css',
})
export class LoginCard {
  username = '';
  password = '';

  validation = signal('');
  severityValidation = 'error';

  isLogged: any;
  loading: boolean = false;
  token$;
  user$;
  errorMessage$;

  constructor(private store: Store, public router: Router) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));
    this.errorMessage$ = toSignal(this.store.select(selectAuthError));

    this.isLogged = signal(this.store.select(selectIsLogged));

    effect(() => {
      const user = this.user$();
      if (user) {
        if (user.role_id === 1) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  onLogin = () => {
    this.loading = true;
    setTimeout(() => {
      this.getValidationLogin();
      this.loading = false;
      this.isLogged = true;
    }, 700);
  };

  getValidationLogin = () => {
    if (this.username === '' && this.password === '') {
      this.validation.set('Los campos no pueden estar vacíos');
    } else {
      if (!this.username || !this.password) {
        this.validation.set('Los campos no pueden estar vacíos');
      } else {
        this.validation.set('');
        this.store.dispatch(
          loginRequestInit({ username: this.username, password: this.password })
        );
      }
    }
  };
}
