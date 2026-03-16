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

## Crear una nueva vista

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
