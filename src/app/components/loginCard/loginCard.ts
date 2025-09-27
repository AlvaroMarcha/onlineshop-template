import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequestInit, logout } from '../../store/auth/auth.actions';
import {
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
  severityValidation = 'warn';

  isLogged: any;
  loading: boolean = false;
  token$;
  user$;

  constructor(private store: Store, public router: Router) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));

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

  onLogin = (
    username: string = this.username,
    password: string = this.password
  ) => {
    this.loading = true;
    setTimeout(() => {
      this.getValidationLogin(username, password);
      this.loading = false;
      this.isLogged = true;
    }, 700);
  };

  getValidationLogin(username: string, password: string): void {
    if (this.username === '' && this.password === '') {
      this.severityValidation = 'error';
      this.validation.set('Los campos no pueden estar vacíos');
    } else {
      if (this.username === username && this.password === password) {
        this.store.dispatch(loginRequestInit({ username, password }));
      }
      this.severityValidation = 'warn';
      this.validation.set('Credenciales incorrectas');
    }
  }
}
