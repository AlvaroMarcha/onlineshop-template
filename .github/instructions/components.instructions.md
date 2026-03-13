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

## Crear una nueva vista

**Carpeta**: `src/app/views/<view-name>/`  
**Archivos**: `<name>.ts`, `<name>.html`, `<name>.css`  
**Registrar**: añadir en `app.routes.ts`

```typescript
// app.routes.ts — lazy-load en rutas admin y features pesadas
{ path: 'admin/dashboard', loadComponent: () => import('./views/private/dashboard/dashboard').then(m => m.Dashboard) }

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
