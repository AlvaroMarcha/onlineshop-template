# Guía de desarrollo — onlineshop-template

> Manual detallado para programadores que se incorporan al proyecto.  
> Cubre desde cero: arquitectura, convenciones, Marcha UI, NgRx y tests.

---

## Índice

1. [Stack y arquitectura](#1-stack-y-arquitectura)
2. [Patrón Singleton — Servicios e inyección de dependencias](#2-patrón-singleton--servicios-e-inyección-de-dependencias)
3. [Convenciones de naming y código](#3-convenciones-de-naming-y-código)
4. [Crear un componente reutilizable](#4-crear-un-componente-reutilizable)
5. [Crear una vista (página con ruta)](#5-crear-una-vista-página-con-ruta)
6. [Marcha UI — Design System](#6-marcha-ui--design-system)
7. [Crear un store NgRx (estado global)](#7-crear-un-store-ngrx-estado-global)
8. [Servicios HTTP](#8-servicios-http)
9. [i18n — Traducciones](#9-i18n--traducciones)
10. [Estilos: Tailwind + PrimeNG](#10-estilos-tailwind--primeng)
11. [Tests (Karma + Jasmine)](#11-tests-karma--jasmine)
12. [Checklist antes de hacer un PR](#12-checklist-antes-de-hacer-un-pr)

---

## 1. Stack y arquitectura

| Capa | Tecnología |
|---|---|
| Framework | Angular 20 (standalone components) |
| Lenguaje | TypeScript 5.8 (strict: true) |
| Estado global | NgRx 20 |
| UI base | Tailwind CSS 4 + PrimeNG |
| Design System | **Marcha UI** (componentes propietarios, prefijo `m-`) |
| i18n | @ngx-translate/core (es / en) |
| HTTP | `@angular/common/http` + `HttpInterceptorFn` |
| Routing | `@angular/router` (functional guards) |
| Formularios | Reactive Forms |
| Tests | Karma 6.4 + Jasmine 5.7 |

### Estructura de carpetas relevante

```
src/app/
├── components/       ← Piezas UI reutilizables (sin ruta propia)
│   └── marcha/       → Design System Marcha (m-button, m-card, m-input…)
├── views/            ← Páginas ligadas a una ruta (wrappers delgados)
├── services/         ← Servicios HTTP (providedIn: 'root')
├── store/            ← NgRx feature stores
│   └── <feature>/    → .actions.ts · .reducer.ts · .effects.ts · .selectors.ts · .state.ts
├── guards/           ← Guards funcionales (CanActivateFn)
├── interceptors/     ← HttpInterceptorFn (JWT, errores)
├── shared/           ← Pipes, utilidades, PrimengModule barrel
├── type/             ← Interfaces y tipos TypeScript
└── assets/i18n/      ← en.json · es.json
```

---

## 2. Patrón Singleton — Servicios e inyección de dependencias

Angular gestiona las dependencias mediante un sistema de inyección de dependencias (DI). El patrón **Singleton** garantiza que una clase tenga **una única instancia** en toda la aplicación, compartida por todos los componentes y servicios que la necesiten.

### ¿Por qué importa?

Si un servicio guarda estado (token JWT, carrito, datos del usuario), necesita ser único. Si se crea una instancia por componente, cada uno tendrá su propio estado aislado, causando inconsistencias difíciles de depurar.

### Cómo declarar un Singleton: `providedIn: 'root'`

Todo servicio se declara con `providedIn: 'root'` en su decorator `@Injectable`. Angular registra automáticamente **una única instancia** en el inyector raíz de la aplicación.

```typescript
// ✅ Correcto — una sola instancia compartida en toda la app
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  setToken(t: string): void  { this.token = t; }
  getToken(): string | null  { return this.token; }
}
```

```typescript
// ❌ INCORRECTO — crea una instancia nueva por componente
@Component({
  selector: 'app-login',
  providers: [AuthService]    // ← NUNCA hacer esto
})
export class LoginCard {}
```

Con el patrón incorrecto, `LoginCard` y `HeaderComponent` tendrían tokens distintos — el login funcionaría pero el header no lo vería.

### Cómo inyectar el Singleton

Hay dos formas según el contexto:

**Inyección por constructor** — en clases (componentes, servicios, effects):

```typescript
@Component({ ... })
export class ShopView {
  constructor(
    private authService: AuthService,
    private store: Store
  ) {}
}
```

**Función `inject()`** — en guards, interceptores y funciones standalone:

```typescript
// guard funcional
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);   // ← inject() fuera de clase
  return auth.isLoggedIn();
};

// interceptor funcional
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### Providers globales — `app.config.ts`

Algunos providers necesitan registrarse explícitamente a nivel de aplicación. Esto se hace en `app.config.ts`, no en componentes:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ /* reducers */ }),
    MessageService,    // ← Toast de PrimeNG: singleton global, no en componentes
  ]
};
```

### Resumen visual

| Situación | Forma correcta |
|---|---|
| Declarar un servicio | `@Injectable({ providedIn: 'root' })` |
| Inyectar en clase | Constructor: `constructor(private svc: MyService)` |
| Inyectar en guard/interceptor | `inject(MyService)` |
| Providers de app (interceptores, toast) | `app.config.ts` |
| ❌ Nunca | `providers: [MyService]` en `@Component` |

---

## 3. Convenciones de naming y código

### Archivos y clases

| Elemento | Formato | Ejemplo |
|---|---|---|
| Archivos | kebab-case | `product-card.ts`, `auth-service.ts` |
| Clases / Components | PascalCase | `ProductCard`, `AuthService` |
| Métodos y propiedades | camelCase | `isLoading`, `fetchProducts()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Interfaces | PascalCase, sin prefijo `I` | `User`, `CartItem` |
| Enums | PascalCase | `AuthStatus` |

### Reglas generales obligatorias

- **`standalone: true`** en todos los componentes — sin NgModules.
- **`ChangeDetectionStrategy.OnPush`** en todos los componentes nuevos.
- **Solo new control flow**: `@if`, `@for (item of list; track item.id)`, `@switch` — nunca `*ngIf`/`*ngFor`.
- **Signals sobre Observables** en componentes. Los Observables solo en NgRx Effects.
- **No `any`** — usar tipos concretos, genéricos o `unknown`.
- Código en **inglés**; comentarios de lógica compleja en **español**.
- Sin `console.log` en código de producción.
- Formularios siempre con **Reactive Forms** — no template-driven (`ngModel`).
- URLs y API keys siempre en `src/environments/environment.ts`, nunca hardcodeadas.

---

## 4. Crear un componente reutilizable

Los componentes reutilizables van en `src/app/components/<feature-name>/` y **nunca tienen ruta propia**.

### Estructura de archivos obligatoria

```
src/app/components/product-card/
├── product-card.ts
├── product-card.html
├── product-card.css      ← Siempre 3 archivos, aunque el CSS esté vacío
└── product-card.spec.ts  ← Tests obligatorios
```

### Plantilla de clase del componente

```typescript
// product-card.ts
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Product } from '../../type/types';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, PrimengModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  // Inputs declarados con input() signal — NO con @Input()
  readonly product = input.required<Product>();
  readonly showBadge = input(false);

  // Outputs declarados con output() — NO con @Output() EventEmitter
  readonly addToCart = output<number>();      // emite el id del producto
  readonly viewDetail = output<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product().id);
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.product());
  }
}
```

> **Selector**: siempre con prefijo `app-` para componentes de la aplicación.  
> Los componentes Marcha usan prefijo `m-`.

### Reglas de inputs y outputs

```typescript
// ✅ Correcto — signal-based
readonly title    = input('');              // input con valor por defecto
readonly product  = input.required<Product>(); // input requerido
readonly disabled = input(false);

readonly save   = output<void>();
readonly select = output<Product>();

// ❌ Incorrecto — decorator-based (no usar)
@Input() title: string = '';
@Output() save = new EventEmitter<void>();
```

### Template del componente

```html
<!-- product-card.html -->
<article class="flex flex-col gap-3 p-4 rounded-lg">
  <h3 class="text-lg font-semibold">{{ product().name }}</h3>
  <p class="text-sm text-gray-500">{{ product().description }}</p>

  @if (showBadge()) {
    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
      {{ 'product.badge_new' | translate }}
    </span>
  }

  <p class="text-xl font-bold">{{ product().price | currency:'EUR' }}</p>

  <m-button
    [label]="'shop.add_to_cart' | translate"
    severity="primary"
    size="small"
    icon="lucide:shopping-cart"
    (click)="onAddToCart()"
  />
</article>
```

**Notas del template:**
- Siempre `@if` y `@for (item of list; track item.id)` — nunca `*ngIf`/`*ngFor`.
- Texto visible siempre con clave i18n (`| translate`), nunca hardcodeado.
- Clases de layout con Tailwind, estilos específicos en el `.css`.

### Consumir el componente en otro lugar

```typescript
// login.ts (vista o componente padre)
import { ProductCard } from '../components/product-card/product-card';

@Component({
  imports: [ProductCard, ...],
})
export class ShopView {
  onAddToCart(productId: number) {
    this.store.dispatch(cartAddRequestInit({ productId }));
  }
}
```

```html
<!-- shop.html -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  @for (product of products(); track product.id) {
    <app-product-card
      [product]="product"
      [showBadge]="product.isNew"
      (addToCart)="onAddToCart($event)"
    />
  }
</div>
```

---

## 5. Crear una vista (página con ruta)

Las vistas van en `src/app/views/<nombre>/` y son wrappers **delgados** que orquestan componentes.

### Estructura de archivos

```
src/app/views/shop/
├── shop.ts
├── shop.html
└── shop.css
```

### Plantilla de vista

```typescript
// shop.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCard } from '../../components/product-card/product-card';
import { selectProducts, selectProductsLoading } from '../../store/products/products.selectors';
import { productsLoadRequestInit } from '../../store/products/products.actions';

@Component({
  selector: 'app-shop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class ShopView {
  // Conectar selectores NgRx con toSignal() — nunca suscribirse manualmente
  readonly products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  readonly loading  = toSignal(this.store.select(selectProductsLoading), { initialValue: false });

  constructor(private store: Store) {
    // Despachar acción de carga al iniciar
    this.store.dispatch(productsLoadRequestInit());
  }
}
```

### Registrar la ruta

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'shop',
    loadComponent: async () => {
      const m = await import('./views/shop/shop');
      return m.ShopView;
    }
  },
  // Rutas de admin: lazy-loading obligatorio
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: async () => {
      const m = await import('./views/private/admin-products/admin-products');
      return m.AdminProducts;
    }
  }
];
```

> **Async/await** en `loadComponent` — nunca `.then(m => m.X)`.

---

## 6. Marcha UI — Design System

Marcha UI es el design system propietario del proyecto. Los componentes se encuentran en `src/app/components/marcha/` con el prefijo `m-`.

### Regla de tamaño por defecto

**SIEMPRE** usar `size="small"` en todos los componentes Marcha UI, salvo excepción justificada.

```html
<!-- ✅ Correcto -->
<m-input formControlName="email" size="small" icon="lucide:mail" />
<m-button label="Enviar" severity="primary" size="small" />
<m-select [formControl]="cityCtrl" size="small" [options]="cities" />

<!-- ❌ Incorrecto — falta size="small" -->
<m-input formControlName="email" icon="lucide:mail" />
```

**Excepciones de naming de size:**
- `m-chip` → usa `size="sm"` (valores: `sm` | `md` | `lg`)
- `m-avatar` → usa `size="small"` | `size="large"` | `size="xlarge"`

### Componentes disponibles y uso

#### Botones

```html
<m-button
  label="Aceptar"
  icon="lucide:check"
  severity="primary"   <!-- primary · secondary · success · warn · danger -->
  variant="filled"     <!-- filled · outline · text · ghost -->
  size="small"
  [disabled]="isLoading()"
  (click)="onSubmit()"
/>
```

#### Inputs de formulario

```html
<!-- Input de texto -->
<m-input
  formControlName="username"
  placeholder="Usuario"
  icon="lucide:user"
  size="small"
/>

<!-- Contraseña -->
<m-password
  formControlName="password"
  size="small"
/>

<!-- Select -->
<m-select
  formControlName="city"
  [options]="cities"
  placeholder="Selecciona ciudad"
  size="small"
/>
<!-- cities: MSelectOption[] = [{ label: 'Madrid', value: 'mad' }] -->

<!-- Checkbox -->
<m-checkbox
  formControlName="terms"
  label="Acepto los términos y condiciones"
/>

<!-- Toggle switch -->
<m-toggle-switch
  formControlName="notifications"
  label="Activar notificaciones"
  size="small"
/>
```

#### Card con glassmorphism

```html
<m-card header="Título de la tarjeta" variant="glass" padding="lg">
  <p>Contenido con efecto glassmorphism</p>
</m-card>
```

#### Iconos (Iconify)

```html
<!-- Formato: {colección}:{nombre} -->
<m-icon icon="lucide:settings" size="20" />
<m-icon icon="lucide:heart" size="20" color="#ef4444" />
```

#### Diálogos y drawers

```html
<!-- Diálogo modal -->
<m-dialog [(visible)]="showDialog" header="Confirmar" size="md">
  <p>¿Estás seguro?</p>
  <m-button label="Confirmar" severity="success" size="small" (click)="onConfirm()" />
</m-dialog>

<!-- Drawer lateral -->
<m-drawer [(open)]="showDrawer" position="right">
  <nav>Contenido del drawer</nav>
</m-drawer>
```

#### Tabla de datos (`MTable`)

```typescript
// En el componente .ts
readonly columns: MTableColumn[] = [
  { field: 'name',   header: 'Nombre',   sortable: true },
  { field: 'price',  header: 'Precio',   sortable: true },
  { field: 'active', header: 'Estado',   type: 'badge'  },
];
```

```html
<m-table
  [columns]="columns"
  [data]="products()"
  [loading]="loading()"
/>
```

### Centrado de botones

Para botones que no deben ocupar el ancho completo del contenedor:

```html
<!-- ✅ Correcto -->
<div class="flex justify-center mt-4">
  <m-button type="submit" severity="primary" size="small" label="Enviar" />
</div>

<!-- ❌ Evitar -->
<m-button size="small" class="w-full" label="Enviar" />
```

### Estilos y `::ng-deep`

Angular aísla los estilos por defecto. Para aplicar estilos a componentes Marcha UI desde un padre, usar `::ng-deep`:

```css
/* component.css */

/* ❌ No funciona — no penetra el componente hijo standalone */
.my-form m-input {
  width: 100%;
}

/* ✅ Correcto */
::ng-deep .my-form m-input {
  width: 100%;
}
```

### Crear un nuevo componente Marcha UI

Si necesitas crear un nuevo componente para el design system:

**Estructura obligatoria — 4 archivos:**

```
src/app/components/marcha/m-rating/
├── m-rating.ts
├── m-rating.html
├── m-rating.css
└── m-rating.spec.ts
```

**Clase base:**

```typescript
// m-rating.ts
import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

export type MRatingSeverity = 'primary' | 'secondary' | 'warn' | 'danger';
export type MRatingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'm-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './m-rating.html',
  styleUrl: './m-rating.css',
})
export class MRating {
  // Inputs (signals de solo lectura)
  readonly value    = input(0);
  readonly max      = input(5);
  readonly size     = input<MRatingSize>('md');
  readonly disabled = input(false);
  readonly severity = input<MRatingSeverity>('primary');

  // Outputs
  readonly valueChange = output<number>();

  // Estado interno
  readonly _hovered = signal<number | null>(null);

  // Computed — clase CSS calculada a partir de signals
  readonly cssClass = computed(() =>
    `m-rating m-rating--${this.size()} m-rating--${this.severity()}` +
    (this.disabled() ? ' is-disabled' : '')
  );

  onSelect(star: number): void {
    if (this.disabled()) return;
    this.valueChange.emit(star);
  }
}
```

**CSS usando variables de tema:**

```css
/* m-rating.css */
.m-rating {
  display: inline-flex;
  gap: var(--m-spacing-xs, 0.25rem);
  align-items: center;
}

.m-rating--sm { font-size: 1rem; }
.m-rating--md { font-size: 1.5rem; }
.m-rating--lg { font-size: 2rem; }

.m-rating.is-disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* BEM: elemento */
.m-rating__star { cursor: pointer; color: var(--m-warn, #f59e0b); }

/* Variables CSS del sistema Marcha */
/* --m-primary, --m-success, --m-warn, --m-danger, --m-glass-bg, etc. */
```

**Registrar en el barrel `index.ts`:**

```typescript
// src/app/components/marcha/index.ts
// ... exports existentes ...
export { MRating } from './m-rating/m-rating';
export type { MRatingSeverity, MRatingSize } from './m-rating/m-rating';
```

---

## 7. Crear un store NgRx (estado global)

Todos los datos compartidos entre componentes se gestionan a través del store NgRx. Los componentes **no llaman servicios directamente** — despachan acciones.

### Estructura de archivos

```
src/app/store/products/
├── products.state.ts
├── products.actions.ts
├── products.reducer.ts
├── products.effects.ts
└── products.selectors.ts
```

### Paso 1 — Definir el estado (`products.state.ts`)

```typescript
import { Product } from '../../type/types';

export interface ProductsState {
  items: Product[];
  selected: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialProductsState: ProductsState = {
  items: [],
  selected: null,
  loading: false,
  error: null
};
```

### Paso 2 — Definir las acciones (`products.actions.ts`)

Patrón de naming: `featureVerb` + sufijo de ciclo de vida.

```typescript
import { createAction, props } from '@ngrx/store';
import { Product } from '../../type/types';

// Cargar listado
export const productsLoadRequestInit  = createAction('[Products] Load Request Init');
export const productsLoadSuccessFinal = createAction('[Products] Load Success Final',
  props<{ items: Product[] }>()
);
export const productsLoadFailure = createAction('[Products] Load Failure',
  props<{ error: string }>()
);

// Seleccionar un producto
export const productsSelectOne = createAction('[Products] Select One',
  props<{ product: Product }>()
);

// Limpiar selección (acción síncrona — sin sufijo de ciclo de vida)
export const productsClearSelection = createAction('[Products] Clear Selection');
```

> Sufijos: `RequestInit` (intención del usuario), `SuccessFinal` (éxito async), `Failure` (fallo async).  
> Acciones síncronas usan verbo directo: `productsSelectOne`, `productsClearSelection`.

### Paso 3 — Reducer (`products.reducer.ts`)

```typescript
import { createReducer, on } from '@ngrx/store';
import { initialProductsState } from './products.state';
import {
  productsLoadRequestInit,
  productsLoadSuccessFinal,
  productsLoadFailure,
  productsSelectOne,
  productsClearSelection
} from './products.actions';

export const productsReducer = createReducer(
  initialProductsState,

  on(productsLoadRequestInit, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(productsLoadSuccessFinal, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),

  on(productsLoadFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(productsSelectOne, (state, { product }) => ({
    ...state,
    selected: product
  })),

  on(productsClearSelection, state => ({
    ...state,
    selected: null
  }))
);
```

> El reducer es **puro e inmutable** — siempre spread operator, nunca mutar el estado.  
> La lógica de negocio (totales, valores derivados) va en los **selectores**, no en el reducer.

### Paso 4 — Effects (`products.effects.ts`)

Los effects manejan operaciones asíncronas (llamadas HTTP) y solo viven aquí.

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductServices } from '../../services/product-services';
import {
  productsLoadRequestInit,
  productsLoadSuccessFinal,
  productsLoadFailure
} from './products.actions';

@Injectable()
export class ProductsEffects {

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsLoadRequestInit),
      exhaustMap(() =>                        // exhaustMap: ignora llamadas mientras hay una en vuelo
        this.productService.getAll().pipe(
          map(items => productsLoadSuccessFinal({ items })),
          catchError(err => of(productsLoadFailure({ error: err.message ?? 'Error desconocido' })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductServices
  ) {}
}
```

**¿Qué operador usar?**

| Operador | Cuándo |
|---|---|
| `exhaustMap` | Login, submit de formularios — ignora llamadas concurrentes |
| `switchMap` | Búsquedas, filtros — cancela la llamada anterior |
| `mergeMap` | Operaciones paralelas independientes |

Siempre `catchError` retornando `of(failureAction)` — nunca dejar morir el stream.

### Paso 5 — Selectores (`products.selectors.ts`)

```typescript
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';   // o el tipo raíz que use el proyecto

const selectProductsState = (state: AppState) => state.products;

export const selectProducts        = createSelector(selectProductsState, s => s.items);
export const selectProductsLoading = createSelector(selectProductsState, s => s.loading);
export const selectProductsError   = createSelector(selectProductsState, s => s.error);
export const selectSelectedProduct = createSelector(selectProductsState, s => s.selected);

// Selector con lógica derivada — NUNCA en el reducer
export const selectProductsCount = createSelector(
  selectProducts,
  items => items.length
);

export const selectAvailableProducts = createSelector(
  selectProducts,
  items => items.filter(p => p.stock > 0)
);
```

### Paso 6 — Registrar el feature en `app.config.ts`

```typescript
// app.config.ts
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { productsReducer } from './store/products/products.reducer';
import { ProductsEffects } from './store/products/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...otros providers
    provideStore({ products: productsReducer }),
    provideEffects([ProductsEffects]),
    // Si el store ya existe, añade el nuevo feature con provideState:
    // provideState('products', productsReducer),
  ]
};
```

### Consumo del store en componentes

```typescript
// shop-view.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts, selectProductsLoading } from '../../store/products/products.selectors';
import { productsLoadRequestInit } from '../../store/products/products.actions';

@Component({
  selector: 'app-shop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ShopView {
  // ✅ toSignal() — nunca .subscribe() manual
  readonly products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  readonly loading  = toSignal(this.store.select(selectProductsLoading), { initialValue: false });

  constructor(private store: Store) {
    this.store.dispatch(productsLoadRequestInit());
  }

  onAddToCart(productId: number): void {
    this.store.dispatch(cartAddRequestInit({ productId }));
  }
}
```

```html
<!-- shop.html -->
@if (loading()) {
  <p>Cargando...</p>
} @else {
  @for (product of products(); track product.id) {
    <app-product-card
      [product]="product"
      (addToCart)="onAddToCart($event)"
    />
  }
}
```

---

## 8. Servicios HTTP

Los servicios hacen las llamadas HTTP. Los componentes **nunca llaman servicios directamente** — el store lo gestiona a través de effects.

### Crear un servicio

```typescript
// product-services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../type/types';

@Injectable({ providedIn: 'root' })   // ← SIEMPRE providedIn: 'root'
export class ProductServices {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

> **Reglas:**
> - `providedIn: 'root'` SIEMPRE — nunca añadir el servicio al `providers: []` de un componente.
> - El token JWT lo añade el **interceptor automáticamente** — nunca añadir `Authorization` manualmente en el servicio.
> - URLs siempre desde `environment.ts`.

---

## 9. i18n — Traducciones

Toda cadena visible al usuario necesita clave de traducción en **ambos** ficheros: `es.json` y `en.json`.

### Añadir nuevas traducciones

**1. Añadir a `src/assets/i18n/es.json`:**

```json
{
  "product": {
    "add_to_cart": "Añadir al carrito",
    "out_of_stock": "Sin stock",
    "reviews_title": "Valoraciones"
  }
}
```

**2. Añadir la misma clave a `src/assets/i18n/en.json`:**

```json
{
  "product": {
    "add_to_cart": "Add to cart",
    "out_of_stock": "Out of stock",
    "reviews_title": "Reviews"
  }
}
```

### Usar en templates

```html
<!-- Pipe — para texto estático -->
<span>{{ 'product.reviews_title' | translate }}</span>

<!-- En atributos o inputs de componentes -->
<m-button [label]="'product.add_to_cart' | translate" severity="primary" size="small" />
<m-input [placeholder]="'auth.email_placeholder' | translate" size="small" />

<!-- Con parámetros dinámicos -->
<span>{{ 'cart.items_count' | translate: { count: cartItems().length } }}</span>
```

### Usar en TypeScript (con LanguageService)

```typescript
// Una clave
const label = await this.lang.tOne('product.add_to_cart');

// Varias claves a la vez (preferido en ngOnInit / constructor)
const t = await this.lang.tMany(['header.home', 'product.reviews_title']);
this.menuItems = [{ label: t['header.home'] }, ...];
```

### Nomenclatura de claves

```
global.*    → error_generic, success, cancel, confirm, save
auth.*      → login_button, email_placeholder, password_placeholder
shop.*      → filter_label, sort_by, no_results
product.*   → add_to_cart, out_of_stock, reviews_title
cart.*      → total, checkout, empty_message
admin.*     → panel de administración
```

---

## 10. Estilos: Tailwind + PrimeNG

### Reglas fundamentales

- Layout y espaciado → **Tailwind** en el template.
- Overrides de componentes hijos o casos imposibles con Tailwind → `.css` del componente.
- **Mobile First** obligatorio: estilos base para móvil, luego `md:`, `lg:`.

### Patrones de layout frecuentes

```html
<!-- Flex responsivo -->
<div class="flex flex-col md:flex-row gap-4">
  ...
</div>

<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ...
</div>

<!-- Centrado vertical y horizontal -->
<div class="flex items-center justify-center min-h-screen">
  ...
</div>
```

### Mobile First en CSS manual

```css
/* ✅ Mobile First — estilos base para móvil, escala hacia arriba */
.container {
  width: 95%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    width: 80%;
    padding: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .container {
    width: 50%;
    padding: 2rem;
  }
}

/* ❌ Desktop First — evitar */
.container {
  width: 50%;  /* desktop por defecto */
}
@media (max-width: 768px) { ... }
```

### PrimeNG

```typescript
// ✅ Siempre el barrel
imports: [PrimengModule, TranslateModule]

// ❌ Nunca importar módulos individuales
imports: [ButtonModule, DialogModule]
```

`<p-toast />` solo en `app.html` raíz — nunca en vistas ni componentes.

### Dark mode

- Se activa añadiendo la clase `.my-app-dark` al elemento `<html>`.
- No usar la variante `dark:` de Tailwind.
- Usar los tokens de tema PrimeNG que responden a `.my-app-dark`.

### Accesibilidad básica

- `<img>` siempre con `alt`.
- Botones sin texto → `aria-label`.
- Usar elementos semánticos: `<main>`, `<nav>`, `<section>`, `<article>`.
- Contraste mínimo WCAG AA: 4.5:1 para texto normal.

---

## 11. Tests (Karma + Jasmine)

**Obligatorio**: todo componente, servicio o feature de store debe tener al menos un test.

### Tipos de test

| Tipo | Setup | Para qué |
|---|---|---|
| Unit puro | Plain Jasmine | Funciones puras, reducers, selectores |
| Unit de servicio | `TestBed` + `HttpClientTestingModule` | Servicios con HTTP |
| Componente | `TestBed` + `ComponentFixture` | Comportamiento y template |
| Store | `provideMockStore` | Integración con NgRx |

Los ficheros `.spec.ts` van **en la misma carpeta** que el archivo que testean.

### Test de reducer (unit puro)

```typescript
// products.reducer.spec.ts
import { productsReducer } from './products.reducer';
import { initialProductsState } from './products.state';
import { productsLoadRequestInit, productsLoadSuccessFinal, productsLoadFailure } from './products.actions';
import { Product } from '../../type/types';

describe('productsReducer', () => {

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialProductsState);
  });

  it('should set loading true on LoadRequestInit', () => {
    const state = productsReducer(initialProductsState, productsLoadRequestInit());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate items on LoadSuccessFinal', () => {
    const items: Product[] = [{ id: 1, name: 'Test', price: 10, stock: 5 } as Product];
    const state = productsReducer(initialProductsState, productsLoadSuccessFinal({ items }));
    expect(state.items.length).toBe(1);
    expect(state.loading).toBeFalse();
  });

  it('should set error on LoadFailure', () => {
    const state = productsReducer(initialProductsState, productsLoadFailure({ error: 'Error de red' }));
    expect(state.error).toBe('Error de red');
    expect(state.loading).toBeFalse();
  });

});
```

### Test de selector (unit puro)

```typescript
// products.selectors.spec.ts
import { selectProductsCount, selectAvailableProducts } from './products.selectors';
import { Product } from '../../type/types';

describe('selectProductsCount', () => {
  it('should return number of items', () => {
    const items: Product[] = [
      { id: 1, name: 'A', price: 10, stock: 5 } as Product,
      { id: 2, name: 'B', price: 20, stock: 0 } as Product,
    ];
    expect(selectProductsCount.projector(items)).toBe(2);
  });
});

describe('selectAvailableProducts', () => {
  it('should filter products with stock > 0', () => {
    const items: Product[] = [
      { id: 1, name: 'A', price: 10, stock: 5 } as Product,
      { id: 2, name: 'B', price: 20, stock: 0 } as Product,
    ];
    const result = selectAvailableProducts.projector(items);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });
});
```

### Test de servicio con HTTP

```typescript
// product-services.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductServices } from './product-services';
import { environment } from '../../environments/environment';

describe('ProductServices', () => {
  let service: ProductServices;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductServices]
    });
    service = TestBed.inject(ProductServices);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());   // asegura que no hay requests pendientes

  it('should return products list', () => {
    const mockProducts = [{ id: 1, name: 'Test', price: 10 }];

    service.getAll().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
```

### Test de componente

```typescript
// product-card.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Product } from '../../type/types';

const mockProduct: Product = { id: 1, name: 'Producto Test', price: 29.99, stock: 10 } as Product;

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  let component: ProductCard;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductCard,
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState: {} })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;

    // Establecer inputs requeridos
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product name', () => {
    const nameEl = fixture.nativeElement.querySelector('h3');
    expect(nameEl.textContent).toContain('Producto Test');
  });

  it('should emit addToCart with product id when button is clicked', () => {
    const emittedIds: number[] = [];
    component.addToCart.subscribe((id: number) => emittedIds.push(id));

    component.onAddToCart();
    expect(emittedIds[0]).toBe(1);
  });

  it('should not show badge when showBadge is false', () => {
    fixture.componentRef.setInput('showBadge', false);
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('[data-testid="badge"]'));
    expect(badge).toBeNull();
  });
});
```

### Ejecutar tests

```bash
npm test                              # Modo watch interactivo
npm test -- --watch=false             # Ejecución única (CI / pre-PR)
npm test -- --include="**/products*"  # Solo tests que coincidan con el patrón
```

---

## 12. Checklist antes de hacer un PR

Sigue esta lista antes de crear cualquier PR:

### Código

- [ ] `standalone: true` en todos los componentes nuevos
- [ ] `ChangeDetectionStrategy.OnPush` en todos los componentes nuevos
- [ ] Sin `*ngIf`/`*ngFor` — solo `@if`/`@for`
- [ ] `@for` siempre con `track item.id` (o la propiedad única)
- [ ] Sin `any` en TypeScript
- [ ] Sin `console.log`
- [ ] Sin texto hardcodeado en templates — todo con `| translate`
- [ ] URLs y API keys en `environment.ts`
- [ ] Servicios con `providedIn: 'root'` — nunca en `providers: []` de un componente
- [ ] El interceptor añade el JWT — no los servicios manualmente

### NgRx

- [ ] Naming de acciones: `featureVerbRequestInit` / `featureVerbSuccessFinal` / `featureVerbFailure`
- [ ] Reducer puro e inmutable (spread operator)
- [ ] Lógica derivada en selectores, no en reducers
- [ ] `toSignal()` para consumir selectores — sin `.subscribe()` manual
- [ ] Effects con `catchError` siempre

### Marcha UI

- [ ] `size="small"` en todos los componentes Marcha UI
- [ ] `TranslateModule` importado en componentes que usen `| translate`
- [ ] Nuevos componentes Marcha exportados desde `index.ts`

### i18n

- [ ] Clave añadida en `es.json` **y** `en.json`
- [ ] Misma estructura de clave en ambos ficheros

### Tests

- [ ] Test creado para el componente/servicio/feature nuevo
- [ ] `npm test -- --watch=false` pasa al 100%
- [ ] Sin llamadas HTTP reales en tests — todo con `HttpClientTestingModule`
- [ ] Store mockeado con `provideMockStore` en tests de componente

### Git

- [ ] Rama con naming correcto: `feature/xxx`, `bugfix/xxx`, `fix/xxx`
- [ ] Commit con formato conventional: `feat(scope): descripción en español`
- [ ] PR apunta a `develop` — nunca a otra rama feature
- [ ] PR < 900 líneas (máximo 1000)

---

## Referencias rápidas

### Variables CSS de Marcha UI

```css
--m-primary: #6366f1;
--m-secondary: #64748b;
--m-success: #10b981;
--m-warn: #f59e0b;
--m-danger: #ef4444;
--m-glass-bg: rgba(255,255,255,.7);
--m-glass-border: rgba(0,0,0,.1);
--m-blur: 12px;
--m-radius-sm: 0.25rem;
--m-radius-md: 0.5rem;
--m-radius-lg: 0.75rem;
--m-radius-xl: 1rem;
```

### Naming de acciones NgRx

```
productsLoadRequestInit     ← usuario dispara la carga
productsLoadSuccessFinal    ← HTTP responde OK
productsLoadFailure         ← HTTP responde error

cartAddRequestInit          ← usuario añade al carrito
cartRemoveRequestInit       ← usuario elimina del carrito
cartClearItems              ← acción síncrona directa
```

### Estructura de estado NgRx

```typescript
interface FeatureState {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

### Iconos (Iconify)

```
lucide:user          lucide:settings      lucide:check
lucide:x             lucide:trash-2       lucide:edit
lucide:plus          lucide:minus         lucide:search
lucide:shopping-cart lucide:heart         lucide:star
lucide:arrow-left    lucide:arrow-right   lucide:chevron-down
lucide:mail          lucide:lock          lucide:eye
lucide:eye-off       lucide:save          lucide:upload
lucide:download      lucide:filter        lucide:sort-asc
```
