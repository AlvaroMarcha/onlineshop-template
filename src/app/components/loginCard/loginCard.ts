import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequestInit, logout } from '../../store/auth/auth.actions';
import { selectToken, selectUser } from '../../store/auth/auth.selectors';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

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

  token$;
  user$;

  constructor(private store: Store, public router: Router) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));

    console.log(this.token$());
  }

  onLogin = (
    username: string = this.username,
    password: string = this.password
  ) => {
    this.store.dispatch(loginRequestInit({ username, password }));
  };
}
