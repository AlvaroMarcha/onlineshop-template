# AGENTS.md

> Guía de referencia rápida para agentes de IA. Para instrucciones detalladas por dominio, consulta los archivos en `.github/instructions/`.

---

## ¿Qué es este proyecto?

Frontend de una tienda online — **Angular 20 + NgRx + TypeScript + PrimeNG + Tailwind CSS**.  
SPA que consume una API REST Spring Boot. Gestiona auth, catálogo, carrito, pedidos, pagos (Stripe.js), perfil de usuario e i18n (es/en).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 20.x (standalone components) |
| Lenguaje | TypeScript 5.8 |
| Estado | NgRx 20.0.1 (stores: auth · cart · products) |
| UI | PrimeNG 20 + Tailwind CSS 4.x |
| i18n | @ngx-translate/core (es / en) |
| HTTP | @angular/common/http + HttpInterceptorFn |
| Routing | @angular/router (functional guards) |
| Formularios | Reactive Forms (@angular/forms) |
| Tests | Karma 6.4 + Jasmine 5.7 |
| Build | Angular CLI 20 / ng build |

---

## Arquitectura

```
src/app/
├── components/   ← Componentes reutilizables (nunca tienen ruta propia)
├── views/        ← Páginas ligadas a una ruta (wrappers delgados)
├── services/     ← Servicios HTTP (providedIn: 'root')
├── store/        ← NgRx feature stores
│   └── feature/  → .actions.ts · .reducer.ts · .effects.ts · .selectors.ts · .state.ts
├── guards/       ← Guards funcionales (CanActivateFn)
├── interceptors/ ← HttpInterceptorFn (JWT auth, manejo de errores)
├── shared/       ← Utilidades puras, pipes, módulos comunes
│   └── primeng/  → PrimengModule barrel
├── type/         ← Interfaces y tipos TypeScript
└── theme/        ← Configuración del tema PrimeNG
```

---

## Convenciones esenciales

- **`standalone: true` en todos los componentes** — sin NgModules en el código de la app.
- **Signals sobre Observables** en componentes — usar `toSignal()` para conectar selectores NgRx.
- **New control flow únicamente**: `@if`, `@for`, `@switch` — nunca `*ngIf`/`*ngFor`.
- **Inyección por constructor** — o `inject()` en contextos funcionales (guards, interceptores).
- **Singleton estricto: siempre `providedIn: 'root'`** — nunca `providers: [Service]` en el decorator de un componente.
- Código en **inglés**; comentarios de lógica compleja en **español**.
- Archivos: `kebab-case` | Clases: `PascalCase` | Propiedades/métodos: `camelCase`.
- Naming store: `featureVerbRequestInit` → `featureVerbSuccessFinal` / `featureVerbFailure`.

---

## Reglas de negocio no negociables

- `totalAmount` se **calcula siempre en el backend** — el frontend solo envía `productId + quantity`.
- `Authorization: Bearer <token>` lo añade **exclusivamente el interceptor HTTP** — nunca manualmente en servicios.
- URLs y configuración de entorno van en `src/environments/environment.ts` — nunca hardcodeadas.
- Todas las cadenas visibles al usuario **deben tener clave i18n en `es.json` Y `en.json`** — sin texto hardcodeado.
- Las rutas de admin **deben usar lazy-loading**: `loadComponent(() => import(...))`.
- **Estado global solo a través del store NgRx** — los componentes no llaman servicios directamente.

---

## Skills disponibles

| Skill | Archivo | Cuándo usarla |
|---|---|---|
| Reglas Angular | `angular-rules.instructions.md` | Convenciones generales Angular/TypeScript, singleton |
| Componentes y Vistas | `components.instructions.md` | Crear componentes, vistas, guards, rutas |
| NgRx Store | `store.instructions.md` | Estado, acciones, effects, selectores |
| Tests | `testing.instructions.md` | Tests Karma/Jasmine: unit, componente, store |
| i18n | `i18n.instructions.md` | Añadir/editar traducciones |
| UI (PrimeNG + Tailwind) | `ui.instructions.md` | Templates, estilos, diseño responsive |
| Git y CI/CD | `git.instructions.md` | Flujo de ramas, commits, PRs |

> **Stripe.js**: cuando se implemente el flujo de pago frontend (confirmCardPayment, etc.), se creará `stripe.instructions.md`.

---

## Git y CI/CD

### 🔴 REGLAS CRÍTICAS ANTES DE CREAR UN PR
1. **Tests primero**: SIEMPRE ejecutar `npm test -- --watch=false` — deben pasar al 100%
2. **PRs pequeños**: < 900 líneas (ideal), máximo 1000 líneas. Dividir si es mayor.
3. **PRs autocontenidos**: cada PR debe funcionar independientemente y pasar tests por sí solo.
4. **❌ NUNCA crear PRs interdependientes** que necesiten mergearse entre sí para pasar tests.
5. **❌ NUNCA hacer push con tests rotos**.

### Flujo de trabajo
- **develop**: rama principal de trabajo
- **master**: rama de producción con releases automáticas
- **Flujo en cascada**: branch `feature/|bugfix/|refactor/|hotfix/` + descripción-corta → PR a develop → develop → master automático

### Conventional Commits (Obligatorio)
- **Formato**: `tipo(scope): descripción en español`
- **Tipos**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `chore`
- **Ejemplos**:
  - `feat(auth): añadir interceptor HTTP para JWT`
  - `fix(cart): corregir cálculo de totales en selector`
  - `test(components): añadir tests del componente Header`

### Reglas para Agentes IA
- ✅ ANTES de cualquier push: `npm test -- --watch=false` al 100%
- ✅ PRs < 900 líneas (ideal), < 1000 máximo
- ✅ Dividir PRs grandes automáticamente en PRs más pequeños y secuenciales
- ✅ Tests OBLIGATORIOS en cada PR o en PR final dedicada
- ❌ **NUNCA crear PRs interdependientes**
- ❌ **NUNCA hacer push con tests rotos**
- ❌ **NUNCA mergear PRs sin aprobación manual explícita del usuario**
- ❌ **NUNCA usar `gh pr merge` sin que el usuario lo solicite**
