# IMPROVEMENTS.md

> Mejoras detectadas en el proyecto tras análisis estático del código.  
> Organizadas por prioridad. Las 4 críticas tienen plan de PR inmediato.

---

## 🔴 CRÍTICAS — PRs planificados (implementación inmediata)

### PR-1 · `fix(security): añadir interceptor HTTP para JWT Bearer`

**Problema**: Ninguna llamada a la API incluye el header `Authorization: Bearer <token>`. El token se guarda en el store pero nunca se envía al backend. Las peticiones autenticadas fallan silenciosamente o llegan sin autenticar.

**Archivos a crear/modificar**:
- ➕ `src/app/interceptors/auth.interceptor.ts` (nuevo)
- ✏️ `src/app/app.config.ts` — registrar el interceptor con `withInterceptors([authInterceptor])`

**Implementación**:
```typescript
// src/app/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const token = toSignal(store.select(selectToken))();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

**Tests obligatorios**: verificar que el header se añade cuando hay token, y que no se añade en peticiones públicas (login, registro).

---

### PR-2 · `fix(types): eliminar any types y console.logs`

**Problema A — `any` types** (8 ocurrencias): TypeScript no puede verificar el código ni ofrecer autocompletado. Errores en runtime que deberían ser compile-time.

| Archivo | Línea | `any` → Tipo correcto |
|---|---|---|
| `src/app/components/product-component/product-component.ts` | ~21 | `any[]` → `GalleriaImage[]` (nueva interface) |
| `src/app/components/product-component/product-component.ts` | ~25 | `any[]` → `ResponsiveOption[]` (PrimeNG) |
| `src/app/components/gallery/carousel/carousel.ts` | ~16 | `any[]` → `ResponsiveOption[]` |
| `src/app/components/loginCard/loginCard.ts` | ~30 | `any` → `Signal<boolean \| undefined>` |
| `src/app/components/header/header.ts` | ~47 | `any` → `Signal<boolean \| undefined>` |
| `src/app/components/registerCard/registerCard.ts` | ~33 | `any` → `Signal<boolean \| undefined>` |
| `src/app/store/products/products.actions.ts` | ~28 | `{ error: any }` → `{ error: string }` |
| `src/app/store/auth/auth.actions.ts` | ~31 | `{ error: any }` → `{ error: string }` |

**Problema B — `console.log` en producción** (3 ocurrencias):

| Archivo | Contenido |
|---|---|
| `src/app/components/drawer-cookies/drawer-cookies.ts` | `console.log('Preferencias guardadas:', ...)` |
| `src/app/components/private/header-back/header-back.ts` | `command: () => console.log('Ir a Dashboard')` |
| `src/app/components/registerCard/registercard.ts` | `console.log('Success')` |

**Tests obligatorios**: verificar que los componentes y acciones modificadas compilan y funcionan correctamente.

---

### PR-3 · `fix(config): crear archivos de environment`

**Problema**: Los servicios referencian `environment.urls.productsUrl` y `environment.urls.authUrl`, pero los ficheros `src/environments/environment.ts` y `environment.prod.ts` **no existen**. La aplicación no arranca en ningún entorno.

**Archivos a crear/modificar**:
- ➕ `src/environments/environment.ts` (dev)
- ➕ `src/environments/environment.prod.ts` (prod)
- ➕ `src/environments/environment.example.ts` (plantilla versionada, sin secretos)
- ✏️ `angular.json` — añadir `fileReplacements` para producción

**Estructura**:
```typescript
// environment.example.ts — sí versionado
export const environment = {
  production: false,
  urls: {
    authUrl: 'http://localhost:8080/api/auth',
    productsUrl: 'http://localhost:8080/api/products',
    ordersUrl: 'http://localhost:8080/api/orders',
    stripePublicKey: 'pk_test_...'
  }
};
```

**Nota**: `environment.ts` y `environment.prod.ts` permanecen gitignored (contienen URLs reales). Solo `environment.example.ts` se versiona.

**Tests obligatorios**: verificar que los servicios inyectan correctamente el environment.

---

### PR-4 · `fix(singleton): mover MessageService a provider global`

**Problema**: `MessageService` de PrimeNG está declarado en `providers: []` de 2 componentes:
- `src/app/components/header/header.ts` — `providers: [MessageService]`
- `src/app/views/client-profile/client-profile.ts` — `providers: [MessageService]`

Esto crea instancias separadas por componente, rompiendo el patrón singleton. Toasts disparados desde un componente no son visibles desde otro. Al destruirse el componente, se pierde la instancia.

**Archivos a modificar**:
- ✏️ `src/app/app.config.ts` — añadir `MessageService` a providers globales
- ✏️ `src/app/components/header/header.ts` — eliminar `providers: [MessageService]`
- ✏️ `src/app/views/client-profile/client-profile.ts` — eliminar `providers: [MessageService]`
- ✏️ `src/app/app.html` — confirmar que `<p-toast />` está en el root (único punto de salida)

**Tests obligatorios**: verificar que los mensajes toast se muestran correctamente tras la migración.

---

## 🟠 ALTAS — Planificar en próximo ciclo

### A1 · No hay lazy loading en rutas admin

**Archivo**: `src/app/app.routes.ts`  
`{ path: 'admin/dashboard', component: Dashboard }` carga toda la ruta admin en el bundle inicial.  
**Fix**: `loadComponent: () => import('./views/private/dashboard/dashboard').then(m => m.Dashboard)`

### A2 · Auth guard no valida expiración del token

**Archivo**: `src/app/guards/auth-guard.ts`  
Solo comprueba si existe `isLogged` en el store. No valida si el token JWT ha expirado.  
**Fix**: decodificar el token y comprobar el claim `exp` antes de permitir la navegación. Redirigir a login y limpiar el store si ha expirado.

### A3 · Template-driven forms en login y registro

**Archivos**: `src/app/components/loginCard/loginCard.ts`, `registerCard/registercard.ts`  
Usan `[(ngModel)]` con validación manual. Sin `FormGroup` no hay validación reactiva, async validators, ni integración con PrimeNG form states.  
**Fix**: migrar a Reactive Forms con `FormBuilder`, `Validators` y mensajes de error por campo.

### A4 · Subscription leak en LanguageService

**Archivo**: `src/app/services/language-service.ts`  
`onLanguageChange()` suscribe a `translate.onLangChange` pero nunca devuelve una función de limpieza. Cada vez que el componente se inicializa, añade una nueva suscripción acumulativa.  
**Fix**: retornar una función `unsubscribe` o usar `takeUntilDestroyed()`.

### A5 · setTimeout artificiales en login y registro

**Archivos**: `loginCard.ts` (~700ms), `registercard.ts` (~1200ms)  
Simulan latencia de red con `setTimeout` antes de leer el resultado del store. Si la red es más lenta, el estado aún no habrá llegado; si es más rápida, el usuario espera innecesariamente.  
**Fix**: reaccionar al estado del store con `effect()` o un selector que escuche `loading: false`.

---

## 🟡 MEDIAS — Backlog técnico

### M1 · 15+ strings hardcodeados en español sin clave i18n

Principales afectados:
- `src/app/components/header/header.ts` — `label: 'Galería'`, `'Perfil'`, `'Cerrar sesión'`, `'Idioma'`
- `src/app/components/private/header-back/header-back.ts` — `label: 'Categorías'`
- `src/app/views/client-profile/client-profile.html` — `legend="Imagen de perfil"`, `"Cambiar imagen"`, etc.
- `src/app/views/shop/shop.html` — `label="Añadir"`, `label="Ver"`
- `src/app/components/header/header.html` — `onLabel="Oscuro"`, `offLabel="Claro"`, `Total:`

**Fix**: añadir claves en `es.json`/`en.json` y sustituir texto por `{{ 'key' | translate }}`.

### M2 · Sin OnPush change detection

Ningún componente existente usa `ChangeDetectionStrategy.OnPush`.  
Cada evento DOM (scroll, mouse move, timer) activa el ciclo de detección de cambios en **toda** la app.  
**Fix**: añadir `changeDetection: ChangeDetectionStrategy.OnPush` a todos los componentes, empezando por los más usados (Header, Cart, ProductComponent).

### M3 · Naming inconsistente de signals

Algunos signals tienen sufijo `$` (convención Observable) mezclado con nombres sin sufijo:  
`this.user$`, `this.isLogged`, `this.totalAmount`, `this.itemsCartCount`  
**Fix**: eliminar el sufijo `$` de todas las signals (reservarlo para Observables).

### M4 · Falta `track` en algunos bucles `@for`

- `src/app/components/registerCard/registerCard.html` — `*ngFor` sin track (también usa sintaxis antigua)
- `src/app/components/cart/cart.html` — `*ngFor` sin track (también usa sintaxis antigua)

**Fix**: migrar a `@for (item of items; track item.id)`.

### M5 · Sin retry ni timeout en llamadas HTTP

Las llamadas de efectos NgRx no tienen `retry()` ni `timeout()`.  
Un error de red transitorio falla inmediatamente; una petición colgada espera indefinidamente.  
**Fix**: añadir `timeout(10000)` y `retry({ count: 2, delay: 1000 })` en los effects críticos.

### M6 · Lógica de negocio en el reducer del carrito

`src/app/store/cart/cart.reducer.ts` calcula el total dentro del reducer:  
`total: updatedItems?.reduce((sum, i) => sum + i.price * i.quantity, 0)`  
**Fix**: mover el cálculo a un selector memoizado `selectCartTotal`.

### M7 · Doble persistencia de productos (localStorage + store)

`src/app/store/products/products.state.ts` lee de localStorage en `initialState` y también persiste en effects.  
**Fix**: usar un meta-reducer de localStorage o gestionar la persistencia exclusivamente en effects.

---

## 🔵 BAJAS — Nice to have

### B1 · Sin Entity Adapter en el store de productos

El store de productos usa un array plano. Para catálogos grandes, `@ngrx/entity` proporciona operaciones CRUD O(1) y normalización del estado.

### B2 · Sin route resolvers para prefetch de datos

Los componentes cargan datos en `ngOnInit` causando un FCP con skeleton/spinner.  
Usar `ResolveFn` permite precargar datos antes de activar la ruta.

### B3 · Tipo inconsistente de ID entre interfaces

`ProductItem.id: string` (en `types.ts`) frente a `Product.id: number` y `ProductCartItem.id: number`.  
Unificar a `number` (consistente con el backend que usa `Long`).

---

## Resumen de deuda técnica

| Prioridad | Items | Estado |
|---|---|---|
| 🔴 Crítica | 4 | PRs planificados arriba |
| 🟠 Alta | 5 | Próximo ciclo |
| 🟡 Media | 7 | Backlog técnico |
| 🔵 Baja | 3 | Nice to have |

**Total: 19 mejoras identificadas.**
