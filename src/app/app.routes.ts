import { Routes } from '@angular/router';
import { InitPage } from './views/init-page/init-page';
import { Login } from './views/login/login';
import { Register } from './views/register/register';

export const routes: Routes = [
  { path: '', component: InitPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
