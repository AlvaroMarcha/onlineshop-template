---
applyTo: "**"
---

# Git & CI/CD — onlineshop-template

> Misma estrategia que el backend (`onlineshop_backend`). Adaptado para Angular / npm.

---

## Estrategia de ramas

| Rama | Propósito |
|---|---|
| `master` | Producción — releases automáticas, nunca commit directo |
| `develop` | Rama principal de trabajo — todos los PRs apuntan aquí |
| `feature/xxx` | Nuevas funcionalidades |
| `bugfix/xxx` | Corrección de bugs |
| `refactor/xxx` | Refactors sin cambio de comportamiento |
| `hotfix/xxx` | Fixes críticos en producción |

Nombres de rama: **lowercase kebab-case** (ej: `feature/interceptor-jwt`, `bugfix/cart-total`).

---

## Conventional Commits (OBLIGATORIO)

```
tipo(scope): descripción en español, en presente
```

**Tipos**: `feat` · `fix` · `refactor` · `perf` · `test` · `docs` · `style` · `chore`

**Ejemplos**:
```
feat(auth): añadir interceptor HTTP para JWT Bearer
fix(store): corregir selector de total del carrito
test(components): añadir tests del componente Header
refactor(forms): migrar login a Reactive Forms
chore(deps): actualizar PrimeNG a v20.1
docs(readme): añadir instrucciones de entorno
```

- BREAKING CHANGE: usar `!` en el tipo o añadir `BREAKING CHANGE:` en el cuerpo.
- Incluir referencia a issue cuando corresponda: `Fixes #123`.

---

## Pull Requests

### 🔴 ANTES de crear un PR

```bash
npm test -- --watch=false   # debe pasar al 100%
npm run build               # debe completar sin errores
```

### Reglas de PR

- **Tamaño**: < 900 líneas (ideal), máximo 1000 líneas — merge bloqueado si supera 1000
- **Autocontenidos**: deben pasar `npm test -- --watch=false` de forma independiente, sin otros PRs
- **Título**: mismo formato que conventional commit (ej: `feat(auth): añadir interceptor JWT`)
- **❌ NUNCA**: PRs interdependientes, push con tests rotos, mergear sin aprobación del propietario
- **Auto-merge**: solo tras aprobación manual + CI pasando + conventional commit + < 1000 líneas

### Flujo de 3 fases para nuevas funcionalidades

1. **FASE 1 — Modelo**: tipos, interfaces, shape del estado — 1 PR
2. **FASE 2 — Lógica**: servicio, store feature (acciones, reducer, effects) — 1 PR
3. **FASE 3 — Presentación**: componente, vista, registro de ruta — 1 PR

Tests obligatorios en cada fase, o en una PR final dedicada a tests.

---

## Pipeline CI/CD

- **Tests automáticos** en cada PR (`npm test -- --watch=false`)
- **Aprobación manual requerida** — NUNCA mergear PRs sin aprobación explícita del propietario
- **Auto-merge** a master tras aprobación manual + tests pasando
- **Releases**: semantic-release en master (versionado automático)
  - `feat:` → minor | `fix:` → patch | `BREAKING CHANGE` → major
- **CHANGELOG.md**: generado automáticamente
- **Branch cleanup**: ramas mergeadas se borran automáticamente

---

## Límites PR

- **Warning**: > 900 líneas → label `size/large`
- **Bloqueado**: > 1000 líneas → merge rechazado

---

## Reglas para Agentes IA

- ✅ ANTES de cualquier push: `npm test -- --watch=false` al 100%
- ✅ PRs < 900 líneas (ideal), < 1000 máximo estricto
- ✅ PRs autocontenidos que pasan tests de forma independiente
- ✅ Dividir PRs grandes automáticamente en PRs más pequeños y secuenciales
- ✅ Reportar estado de las PRs creadas
- ❌ **NUNCA crear PRs interdependientes** que requieran mergearse entre sí para pasar tests
- ❌ **NUNCA hacer push con tests rotos**
- ❌ **NUNCA mergear PRs sin aprobación manual explícita del usuario**
- ❌ **NUNCA usar `gh pr merge` sin que el usuario lo solicite**
