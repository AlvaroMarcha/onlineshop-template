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
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Design system demo (dev only)
  { path: 'demo', loadComponent: async () => (await import('./views/demo/demo')).Demo },
  // Public
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
  // Private (BackOffice) — AdminLayout shell con children lazy-loaded
  {
    path: 'admin',
    loadComponent: async () =>
      (await import('./components/private/admin-layout/admin-layout')).AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: async () =>
          (await import('./views/private/dashboard/dashboard')).Dashboard,
      },
      // FASE 3 — Catálogo
      {
        path: 'products',
        loadComponent: async () =>
          (await import('./views/private/products/products')).ProductsAdmin,
      },
      {
        path: 'products/new',
        loadComponent: async () =>
          (await import('./views/private/product-form/product-form')).ProductForm,
      },
      {
        path: 'products/:id',
        loadComponent: async () =>
          (await import('./views/private/product-form/product-form')).ProductForm,
      },
      // FASE 4 — Categorías y Atributos
      {
        path: 'categories',
        loadComponent: async () =>
          (await import('./views/private/categories/categories')).CategoriesAdmin,
      },
      {
        path: 'attributes',
        loadComponent: async () =>
          (await import('./views/private/attributes/attributes')).AttributesAdmin,
      },
      // FASE 5 — Pedidos
      {
        path: 'orders',
        loadComponent: async () =>
          (await import('./views/private/orders/orders')).OrdersAdmin,
      },
      {
        path: 'orders/:id',
        loadComponent: async () =>
          (await import('./views/private/order-detail/order-detail')).OrderDetail,
      },
      // FASE 6 — Usuarios
      {
        path: 'users',
        loadComponent: async () =>
          (await import('./views/private/users/users')).UsersAdmin,
      },
      {
        path: 'users/:id',
        loadComponent: async () =>
          (await import('./views/private/user-detail/user-detail')).UserDetail,
      },
      // FASE 7 — Facturas
      {
        path: 'invoices',
        loadComponent: async () =>
          (await import('./views/private/invoices/invoices')).InvoicesAdmin,
      },
      {
        path: 'invoices/:number',
        loadComponent: async () =>
          (await import('./views/private/invoice-detail/invoice-detail')).InvoiceDetail,
      },
      // FASE 8 — Inventario
      {
        path: 'inventory',
        loadComponent: async () =>
          (await import('./views/private/inventory/inventory')).InventoryAdmin,
      },
      {
        path: 'inventory/:productId',
        loadComponent: async () =>
          (await import('./views/private/inventory-product/inventory-product')).InventoryProduct,
      },
    ],
  },
  // Private (user profile)
  {
    path: 'profile',
    loadComponent: async () =>
      (await import('./views/client-profile/client-profile')).ClientProfile,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFound },
];
