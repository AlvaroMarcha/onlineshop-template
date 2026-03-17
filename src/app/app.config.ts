import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';


// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Reducers
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { ProductEffects } from './store/products/products.effects';
import { productReducer } from './store/products/products.reducer';
import { productCartReducer } from './store/cart/cart.reducer';
import { dashboardReducer } from './store/admin/dashboard/dashboard.reducer';
import { DashboardEffects } from './store/admin/dashboard/dashboard.effects';
import { adminProductsReducer } from './store/admin/products/admin-products.reducer';
import { AdminProductEffects } from './store/admin/products/admin-products.effects';
import { adminCatalogReducer } from './store/admin/catalog/admin-catalog.reducer';
import { AdminCatalogEffects } from './store/admin/catalog/admin-catalog.effects';
import { adminOrderReducer }   from './store/admin/orders/admin-order.reducer';
import { AdminOrderEffects }   from './store/admin/orders/admin-order.effects';

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    // NgRx
    provideStore({
      auth: authReducer,
      products: productReducer,
      cart: productCartReducer,
      dashboard: dashboardReducer,
      adminProducts: adminProductsReducer,
      catalog: adminCatalogReducer,
      orders:  adminOrderReducer,
    }),
    provideEffects([AuthEffects, ProductEffects, DashboardEffects, AdminProductEffects, AdminCatalogEffects, AdminOrderEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: isDevMode() }),

    // Angular core
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),

    // Translate
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
