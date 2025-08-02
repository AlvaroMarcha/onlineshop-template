import { Routes } from '@angular/router';
import { InitPage } from './views/init-page/init-page';
import { Login } from './views/login/login';
import { Register } from './views/register/register';
import { Terms } from './views/terms/terms';
import { Priv } from './views/priv/priv';
import { Notice } from './views/notice/notice';
import { Cond } from './views/cond/cond';
import { Contact } from './views/contact/contact';

export const routes: Routes = [
  { path: '', component: InitPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'terms', component: Terms },
  { path: 'priv', component: Priv },
  { path: 'notice', component: Notice },
  { path: 'cond', component: Cond },
  { path: 'contact', component: Contact },
];
