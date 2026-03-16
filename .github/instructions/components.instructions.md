---
applyTo: "src/app/components/**, src/app/views/**, src/app/guards/**"
---

# Componentes y Vistas — onlineshop-template

## Distinción entre las dos carpetas

| Carpeta | Propósito | ¿Tiene ruta? |
|---|---|---|
| `src/app/components/` | Piezas UI reutilizables — header, footer, tarjetas, formularios | No |
| `src/app/views/` | Páginas ligadas a una ruta — wrappers delgados | Sí |

**Regla**: un componente en `components/` nunca importa una vista. Una vista debe ser un wrapper delgado que delega en componentes reutilizables.

```typescript
// ✅ Vista como wrapper delgado
@Component({ selector: 'app-login', imports: [LoginCard], templateUrl: './login.html' })
export class Login {}
```

---

## Crear un nuevo componente

**Carpeta**: `src/app/components/<feature-name>/`  
**Archivos**: `<name>.ts`, `<name>.html`, `<name>.css` (siempre 3 archivos, aunque el CSS esté vacío)  
**Selector prefix**: siempre `app-`

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrimengModule, TranslateModule, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  // Inputs declarados con input() signal
  product = input.required<Product>();

  // Outputs declarados con output()
  addToCart = output<number>();
}
```

---

## Convenciones de tamaño en componentes Marcha UI

**Tamaño por defecto**: `size="small"` para todos los componentes Marcha UI.

Los componentes Marcha UI (m-button, m-input, m-password, m-select, etc.) soportan tamaños: `small`, `medium`, `large`.

**Regla**: usar **`size="small"`** por defecto en toda la aplicación para mantener consistencia visual y diseño compacto.

```html
<!-- ✅ Correcto - size="small" por defecto -->
<m-input formControlName="username" size="small" icon="lucide:user" />
<m-password formControlName="password" size="small" />
<m-button type="submit" severity="primary" size="small" [label]="'Enviar'" />

<!-- ⚠️ Solo usar otros tamaños cuando haya razón específica de UX -->
<m-button size="large" [label]="'CTA Principal'" /> <!-- Hero button -->
```

### Centrado de botones

Para botones pequeños que no deben ocupar todo el ancho del contenedor:

```html
<!-- ✅ Botón centrado sin w-full -->
<div class="flex justify-center mt-2">
  <m-button type="submit" severity="primary" size="small" [label]="'Enviar'" />
</div>

<!-- ❌ Evitar w-full en botones pequeños -->
<m-button size="small" class="w-full" /> <!-- Se ve extraño -->
```

---

## Encapsulamiento de estilos y ::ng-deep

Angular usa **ViewEncapsulation.Emulated** por defecto, lo que aísla los estilos de cada componente. Esto impide que los estilos CSS de un padre penetren en componentes hijos standalone.

### Problema común

```css
/* ❌ NO FUNCIONA - No penetra el componente hijo */
.parent-class m-card {
  width: 100%;
  padding: 2rem;
}
```

Si `m-card` es un componente standalone, el selector CSS anterior **no aplicará** los estilos al componente hijo debido al encapsulamiento.

### Solución: usar ::ng-deep

```css
/* ✅ FUNCIONA - Penetra el encapsulamiento */
::ng-deep .parent-class m-card {
  width: 100%;
  padding: 2rem;
}
```

**Regla**: cuando necesites aplicar estilos a componentes hijos (especialmente de Marcha UI como `m-card`, `m-button`, etc.), usa `::ng-deep` para penetrar el encapsulamiento.

### Pattern completo para componentes wrapper

```css
/* Componente host */
:host {
  display: block;
  width: 100%;
}

.wrapper {
  width: 40%;
  margin: 0 auto;
}

/* Penetrar encapsulamiento para hijos */
::ng-deep .wrapper m-card {
  width: 100%;
  padding: 4rem;
}
```

### Cuándo usar ::ng-deep

- **SÍ**: Aplicar estilos a componentes hijos de Marcha UI (m-card, m-button, m-input, etc.)
- **SÍ**: Overrides de estilos de third-party components (PrimeNG si se usa)
- **NO**: Para estilos normales dentro del mismo componente
- **NO**: Para estilos globales (usar `styles.css` en su lugar)

---

## Diseño Responsive: Mobile First

**Estrategia obligatoria**: usar **Mobile First** para todo el diseño responsive.

### ¿Por qué Mobile First?

- **Más fácil de mantener**: escalar hacia arriba es más simple que reducir
- **Mejor performance**: móviles cargan solo los estilos base
- **Progressive Enhancement**: funcionalidad básica primero, mejoras después
- **Cobertura completa**: más fácil abarcar todas las pantallas

### Pattern Mobile First

```css
/* ❌ EVITAR - Desktop First (obsoleto) */
.container {
  width: 50%;  /* Estilo desktop por defecto */
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    width: 90%;  /* Override para tablet */
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    width: 95%;  /* Override para mobile */
    padding: 0.5rem;
  }
}
```

```css
/* ✅ CORRECTO - Mobile First */
.container {
  width: 95%;  /* Estilo móvil por defecto */
  padding: 0.5rem;
}

@media (min-width: 481px) {
  .container {
    width: 90%;  /* Tablet: mejora progresiva */
    padding: 1rem;
  }
}

@media (min-width: 769px) {
  .container {
    width: 50%;  /* Desktop: mejora progresiva */
    padding: 2rem;
  }
}
```

### Breakpoints estándar

| Breakpoint | min-width | Target |
|---|---|---|
| Base | - | Mobile (< 480px) |
| Small | `481px` | Tablet / Phablet |
| Medium | `769px` | Desktop / Laptop |
| Large | `1025px` | Large Desktop (si necesario) |

### Reglas Mobile First

1. **Estilos base = móvil** — sin media query
2. **Usar `min-width` en media queries** — nunca `max-width`
3. **Breakpoints consistentes** — usar los estándar en toda la app
4. **Progressive enhancement** — agregar complejidad gradualmente

### Ejemplo completo

```css
:host {
  display: block;
  width: 100%;
}

.login-card {
  /* Base: Mobile */
  width: 95%;
  margin: 0 auto;
  padding: 0.5rem;
  min-height: 100vh;
}

::ng-deep .login-card m-card {
  padding: 1.5rem;
}

/* Tablet */
@media (min-width: 481px) {
  .login-card {
    width: 92%;
    padding: 0.75rem;
  }

  ::ng-deep .login-card m-card {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .login-card {
    width: 45%;
    padding: 1.25rem;
    min-height: auto;
  }

  ::ng-deep .login-card m-card {
    padding: 4rem;
  }
}
```

---

## Crear una nueva vista

### 🔴 OBLIGATORIO: Análisis previo y confirmación

Antes de implementar cualquier vista nueva, el agente DEBE:

1. **Analizar y presentar al usuario** un resumen con:
   - Estructura de layout propuesta (columnas, secciones, responsive)
   - Componentes Marcha UI que se usarán y por qué
   - Datos/signals/store que necesita la vista
   - Guards o restricciones de ruta
   - Lista completa de claves i18n nuevas que se añadirán
2. **Esperar confirmación explícita** del usuario antes de escribir ningún archivo.
3. Solo tras la aprobación proceder con la implementación.

### 🌍 OBLIGATORIO: Traducciones en toda vista nueva

**Toda vista nueva debe incluir sus traducciones** en el mismo PR:

1. Añadir la sección correspondiente a `src/assets/i18n/es.json`.
2. Añadir **las mismas claves** a `src/assets/i18n/en.json` con el texto en inglés.
3. Usar `TranslatePipe` (`| translate`) en el template para todos los textos visibles.
4. Para textos dinámicos en TypeScript (tabs, columnas de tabla, labels de gráficos), usar `LanguageService.tMany()` en `ngOnInit` y recargar al cambiar idioma con `LanguageService.onLanguageChange()`.

```typescript
// ✅ Correcto — textos dinámicos con LanguageService
async ngOnInit() {
  await this.loadTranslations();
  this.lang.onLanguageChange(() => this.loadTranslations());
}

private async loadTranslations() {
  const t = await this.lang.tMany([
    'profile.tab_personal',
    'profile.tab_orders',
    'profile.col_id',
  ]);
  this.tabs = [
    { label: t['profile.tab_personal'], icon: 'lucide:user' },
    { label: t['profile.tab_orders'],  icon: 'lucide:receipt' },
  ];
  this.tableColumns = [
    { field: 'id',   header: t['profile.col_id'] },
  ];
}
```

**Carpeta**: `src/app/views/<view-name>/`  
**Archivos**: `<name>.ts`, `<name>.html`, `<name>.css`  
**Registrar**: añadir en `app.routes.ts`

```typescript
// app.routes.ts — lazy-load en rutas admin y features pesadas
{
  path: 'admin/dashboard',
  loadComponent: async () => {
    const m = await import('./views/private/dashboard/dashboard');
    return m.Dashboard;
  },
}

// Rutas públicas pueden ser eager
{ path: 'shop', component: Shop }
```

**Las rutas admin siempre usan `loadComponent` (lazy loading).**

---

## Guards funcionales

Usar `CanActivateFn` con `inject()`:

```typescript
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const isLogged = toSignal(store.select(selectIsLogged));

  if (!isLogged()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

---

## Interacción con el estado en componentes

1. Leer estado con `toSignal(store.select(selector))` — almacenar resultados como signals.
2. Despachar acciones con `store.dispatch(action())`.
3. **Nunca llamar servicios directamente desde un componente** — ir siempre a través del store.

---

## Lifecycle hooks

- `ngOnInit`: despachar acciones de carga inicial, configurar suscripciones.
- `ngOnDestroy`: limpiar suscripciones no gestionadas por `toSignal`.
- Preferir `effect()` sobre `ngOnChanges` para reaccionar a cambios en signals.

---

## Flujo de 3 fases para un nuevo feature con componente

1. **FASE 1 — Modelo**: tipo/interfaz + shape del estado (si aplica) — PR independiente
2. **FASE 2 — Lógica**: servicio + feature store (acciones, reducer, effects) — PR independiente
3. **FASE 3 — Presentación**: componente + vista + registro de ruta — PR independiente

Tests obligatorios en cada fase o en una PR final dedicada. Cada PR debe pasar `npm test -- --watch=false` de forma autónoma.
