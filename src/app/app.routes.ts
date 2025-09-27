import { Routes } from '@angular/router';
import { InitPage } from './views/init-page/init-page';
import { Login } from './views/login/login';
import { Register } from './views/register/register';
import { Terms } from './views/terms/terms';
import { Priv } from './views/priv/priv';
import { Notice } from './views/notice/notice';
import { Cond } from './views/cond/cond';
import { Contact } from './views/contact/contact';
import { About } from './views/about/about';
import { Shop } from './views/shop/shop';
import { ProductView } from './views/product/product';
import { NotFound } from './views/not-found/not-found';
import { Cookies } from './views/cookies/cookies';
import { GalleryView } from './views/gallery/galleryView';
import { Dashboard } from './views/private/dashboard/dashboard';
import { ClientProfile } from './views/client-profile/client-profile';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  //Public
  { path: '', component: InitPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'terms', component: Terms },
  { path: 'priv', component: Priv },
  { path: 'notice', component: Notice },
  { path: 'cond', component: Cond },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'shop', component: Shop },
  { path: 'product/:id', component: ProductView },
  { path: 'gallery', component: GalleryView },
  { path: 'cookies', component: Cookies },
  // Private (BackOffice)
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'profile', component: ClientProfile, canActivate: [authGuard] },
  { path: '**', component: NotFound },
];
