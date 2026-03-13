---
applyTo: "src/app/store/**"
---

# NgRx Store — onlineshop-template

## Estructura por feature

Cada store feature vive en `src/app/store/<feature>/` con exactamente 5 archivos:

```
store/<feature>/
├── <feature>.actions.ts
├── <feature>.reducer.ts
├── <feature>.effects.ts    (omitir si no hay efectos async)
├── <feature>.selectors.ts
└── <feature>.state.ts
```

Registrar el feature en `app.config.ts` via `provideStore({ feature: featureReducer })` o `provideState()`.

---

## Naming de acciones

```typescript
// Patrón: featureVerb + sufijo de ciclo de vida
export const productsLoadRequestInit = createAction('[Products] Load Request Init');
export const productsLoadSuccessFinal = createAction('[Products] Load Success Final', props<{ products: Product[] }>());
export const productsLoadFailure = createAction('[Products] Load Failure', props<{ error: string }>());
```

- `RequestInit` — intención del usuario / disparador
- `SuccessFinal` — éxito de operación async
- `Failure` — fallo de operación async
- Acciones síncronas: verbo directo (`addToCart`, `removeFromCart`, `clearCart`)
- **Nunca usar `any` en `props<>()`** — siempre tipos concretos o `string` para errores.

---

## Shape del estado

```typescript
export interface FeatureState {
  data: T | null;
  loading: boolean;
  error: string | null;  // string, nunca any
}

export const initialState: FeatureState = {
  data: null,
  loading: false,
  error: null
};
```

- Estado **inmutable** — usar spread operator o helpers de `on()`.
- Evitar leer `localStorage` en `initialState` — usar un meta-reducer o un init effect.
- **La lógica de negocio no pertenece al reducer** — totales, valores derivados y cálculos van en selectores.

---

## Patrón de reducer

```typescript
export const featureReducer = createReducer(
  initialState,
  on(featureLoadRequestInit, state => ({ ...state, loading: true, error: null })),
  on(featureLoadSuccessFinal, (state, { data }) => ({ ...state, data, loading: false })),
  on(featureLoadFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
```

---

## Patrón de effects

```typescript
@Injectable()
export class FeatureEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(featureLoadRequestInit),
      exhaustMap(() =>
        this.service.fetchAll().pipe(
          map(data => featureLoadSuccessFinal({ data })),
          catchError(err => of(featureLoadFailure({ error: err.message ?? 'Error desconocido' })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: FeatureService) {}
}
```

| Operador | Cuándo usarlo |
|---|---|
| `exhaustMap` | Requests donde las llamadas concurrentes deben ignorarse (login, submit) |
| `switchMap` | Búsquedas/filtros donde el resultado anterior queda obsoleto |
| `mergeMap` | Operaciones paralelas independientes |

- Siempre `catchError` retornando `of(failureAction)` — nunca dejar morir el stream.

---

## Patrón de selectores

```typescript
const selectFeatureState = (state: AppState) => state.feature;

export const selectData = createSelector(selectFeatureState, s => s.data);
export const selectLoading = createSelector(selectFeatureState, s => s.loading);

// Valores derivados/calculados siempre como selectores, nunca en reducers
export const selectCartTotal = createSelector(
  selectCartItems,
  items => items.reduce((sum, i) => sum + i.price * i.quantity, 0)
);
```

---

## Consumo en componentes

```typescript
data = toSignal(this.store.select(selectData));
loading = toSignal(this.store.select(selectLoading), { initialValue: false });
```

Nunca suscribirse manualmente a selectores del store en componentes — siempre usar `toSignal()`.
