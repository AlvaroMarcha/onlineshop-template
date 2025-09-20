import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginRequest, logout } from '../../store/auth/auth.actions';
import { selectToken, selectUser } from '../../store/auth/auth.selectors';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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

  token$!: any;
  user$!: any;

  constructor(private store: Store, public router: Router) {}

  ngOnInit() {
    this.token$ = this.store.select(selectToken);
    this.user$ = this.store.select(selectUser);

    console.log(this.user$, this.token$);
  }

  onLogin() {
    this.store.dispatch(
      loginRequest({ username: this.username, password: this.password })
    );
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
