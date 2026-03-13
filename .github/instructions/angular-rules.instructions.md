---
applyTo: "src/app/**"
---

# Angular Rules — onlineshop-template

## Fundamentos de componentes

- **Siempre `standalone: true`** — sin NgModules en el código de la app.
- **Archivos separados** para clase, template y estilos: `name.ts`, `name.html`, `name.css`.
- **`ChangeDetectionStrategy.OnPush`** en todos los componentes nuevos.
- **Solo new control flow**: `@if`, `@for`, `@switch` — nunca `*ngIf`, `*ngFor`, `*ngSwitch`.
- Siempre proporcionar `track` en bucles `@for`: `@for (item of items; track item.id)`.

---

## Signals y reactividad

- **Preferir signals sobre Observables** en la clase del componente.
- Conectar selectores NgRx con `toSignal()`: `foo = toSignal(this.store.select(selectFoo))`.
- Usar `computed()` para estado derivado; `effect()` para efectos secundarios.
- **Observables únicamente en NgRx Effects** — en ningún otro sitio.
- Naming de signals: **sin sufijo `$`** (ese sufijo es para Observables). Usar `foo`, no `foo$`.

---

## Inyección de dependencias — Patrón Singleton

- **Inyección por constructor** en clases; `inject()` en guards, interceptores y funciones standalone.
- **`providedIn: 'root'` es obligatorio** para todos los servicios — garantiza una única instancia compartida en toda la app.
- **❌ NUNCA** añadir un servicio a `providers: []` en el decorator `@Component` — rompe el patrón singleton y crea instancias duplicadas con estado inconsistente.
- Los providers globales (interceptores, `MessageService`) van en `app.config.ts`.

```typescript
// ✅ Correcto — singleton
@Injectable({ providedIn: 'root' })
export class AuthService { ... }

// ❌ Incorrecto — crea una instancia nueva por componente
@Component({ providers: [AuthService] })
export class MyComponent { ... }
```

---

## Convenciones de naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos | kebab-case | `auth-service.ts`, `login-card.ts` |
| Clases/Componentes | PascalCase | `AuthService`, `LoginCard` |
| Métodos/propiedades | camelCase | `isLogged`, `fetchProducts()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Interfaces | PascalCase, sin prefijo `I` | `User`, `CartItem` |
| Enums | PascalCase | `AuthStatus` |

---

## TypeScript

- **Sin `any`** — usar tipos concretos, genéricos, o `unknown` solo cuando sea genuinamente dinámico.
- Preferir `type` para uniones/intersecciones; `interface` para formas de objetos.
- Nunca suprimir errores TS con `// @ts-ignore` — arreglar la causa raíz.
- `strict: true` está habilitado — respetarlo siempre.

---

## Imports

- Usar el barrel `PrimengModule` para todos los componentes PrimeNG — nunca importar módulos PrimeNG individuales directamente.
- Importar `TranslateModule` en cada componente que use el pipe `translate`.
- Importar `ReactiveFormsModule` para formularios — no `FormsModule` (template-driven está desaconsejado).
- `CommonModule` solo cuando sea estrictamente necesario.

---

## Environment y configuración

- Todas las URLs y valores específicos de entorno van en `src/environments/environment.ts` (dev) y `environment.prod.ts` (prod).
- Los archivos de environment están gitignored — proporcionar `environment.example.ts` como plantilla.
- Nunca hardcodear URLs del backend ni API keys en servicios o componentes.

---

## Estilo de código

- Código en **inglés**; comentarios de lógica compleja en **español**.
- Sin `console.log` en código de producción — eliminarlos o usar una estrategia de logging adecuada.
- Clases de componente delgadas: fetching de datos → servicio/effect; lógica de presentación → template.
- Métodos de más de 20 líneas se dividen en métodos auxiliares con nombre descriptivo.
- Formularios siempre con **Reactive Forms** (`FormGroup`, `FormBuilder`) — no template-driven (`ngModel`).

---

## Async/Await — estilo moderno

- **Siempre `async/await`** sobre `.then()` / `.catch()` — más legible, más mantenible.
- **❌ NUNCA** encadenar `.then(m => m.X)` en `loadComponent` ni en servicios.
- Usar `try/catch` para manejo de errores en funciones async.

```typescript
// ✅ Correcto — async/await
loadComponent: async () => {
  const m = await import('./views/private/dashboard/dashboard');
  return m.Dashboard;
}

// ❌ Incorrecto — .then()
loadComponent: () => import('./views/private/dashboard/dashboard').then(m => m.Dashboard)
```
