# Configuración de CI/CD — onlineshop-template

Guía para configurar los secrets, permisos y branch protection rules necesarios para que los workflows de GitHub Actions funcionen correctamente.

---

## 📋 Workflows incluidos

| Workflow | Trigger | Descripción |
|---|---|---|
| `ci.yml` | Push/PR a develop/master | Instala dependencias, ejecuta tests, compila |
| `conventional-commits.yml` | PR abierto/editado | Valida título del PR con Conventional Commits |
| `pr-size.yml` | PR abierto/sincronizado | Bloquea PRs > 1000 líneas, avisa > 500 |
| `pr-labels.yml` + `labeler.yml` | PR abierto/sincronizado | Etiqueta PRs automáticamente por archivos tocados |
| `auto-merge-to-develop.yml` | Review aprobado / checks completados | Auto-mergea features aprobadas a develop |
| `auto-merge-to-master.yml` | Review aprobado / checks completados | Auto-mergea develop a master cuando se aprueba |
| `cleanup-branches.yml` | PR cerrado | Elimina ramas mergeadas automáticamente |
| `release.yml` | Push a master | Genera versión semántica, GitHub Release y CHANGELOG.md |

---

## ⚙️ Paso 1: Permisos de Workflows

Ve a **Settings → Actions → General** en el repositorio de GitHub.

**Workflow permissions:**
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

---

## 🛡️ Paso 2: Branch Protection Rules

### Rama `develop`

Ve a **Settings → Branches → Add branch ruleset** (o "Add rule" según la versión de GitHub).

**Branch name pattern:** `develop`

| Opción | Valor |
|---|---|
| Require a pull request before merging | ✅ |
| Required approvals | **1** |
| Dismiss stale PR approvals on new commits | ✅ |
| Require status checks to pass before merging | ✅ |
| Required status checks | `Build and Test` · `Check PR Title` · `PR Size Check` |
| Require branches to be up to date | ❌ (permite auto-merge más rápido) |
| Do not allow bypassing above settings | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

### Rama `master`

**Branch name pattern:** `master`

| Opción | Valor |
|---|---|
| Require a pull request before merging | ✅ |
| Required approvals | **1** |
| Require status checks to pass before merging | ✅ |
| Required status checks | `Build and Test` · `Check PR Title` |
| Do not allow bypassing above settings | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

> ⚠️ **Importante**: los status checks (`Build and Test`, `Check PR Title`, `PR Size Check`) solo aparecen disponibles para seleccionar **después** de que el workflow haya corrido al menos una vez en esa rama. Crea un PR de prueba primero si es necesario.

---

## 🏷️ Paso 3: Crear etiquetas en GitHub

Los workflows de PR size y labeler aplican etiquetas automáticamente. Para que funcionen, crea estas etiquetas en **Issues → Labels**:

| Etiqueta | Color sugerido |
|---|---|
| `size/large` | `#e4e669` (amarillo) |
| `size/xl` | `#e11d48` (rojo) |
| `frontend` | `#3b82f6` (azul) |
| `components` | `#8b5cf6` (violeta) |
| `views` | `#06b6d4` (cyan) |
| `store` | `#f97316` (naranja) |
| `services` | `#10b981` (verde) |
| `auth` | `#ef4444` (rojo claro) |
| `cart` | `#f59e0b` (amber) |
| `tests` | `#22c55e` (verde) |
| `dependencies` | `#94a3b8` (gris) |
| `ci-cd` | `#64748b` (gris oscuro) |
| `styles` | `#ec4899` (rosa) |
| `i18n` | `#a78bfa` (lavanda) |
| `documentation` | `#6366f1` (indigo) |

---

## 🧪 Paso 4: Verificar la configuración

### Test 1: Validar que los workflows se ven en GitHub

Tras mergear este PR a develop, ir a la pestaña **Actions** del repositorio. Deben aparecer los 8 workflows.

### Test 2: Crear un PR de prueba

```bash
git checkout develop
git pull origin develop
git checkout -b feature/test-ci-cd

echo "# CI/CD Test" >> README.md
git add README.md
git commit -m "chore: test pipeline CI/CD"
git push origin feature/test-ci-cd
```

Crear PR a develop desde GitHub. Verificar que se ejecutan:
- ✅ CI — Build and Test
- ✅ Conventional Commits Check
- ✅ PR Size Check
- ✅ Auto Label PRs

### Test 3: Verificar auto-merge

Aprobar el PR de prueba. El workflow `auto-merge-to-develop.yml` debe detectar la aprobación y mergear automáticamente si todos los checks pasan.

---

## 🚀 Flujo completo esperado

1. **Developer crea branch** → `git checkout -b feature/nueva-funcionalidad`
2. **Developer hace commit** → `git commit -m "feat(components): añadir componente de búsqueda"`
3. **Developer crea PR a develop** → GitHub Actions ejecuta `ci.yml`, `conventional-commits.yml`, `pr-size.yml`, `pr-labels.yml`
4. **Propietario aprueba** → `auto-merge-to-develop.yml` detecta aprobación + checks verdes → auto-merge → branch eliminada
5. **Cuando develop está listo para producción** → crear PR develop → master manualmente → propietario aprueba → `auto-merge-to-master.yml` mergea
6. **Push a master** → `release.yml` crea versión semántica, GitHub Release y actualiza `CHANGELOG.md`

---

## 🐛 Troubleshooting

### Auto-merge no se activa

- Verificar que branch protection requiere aprobación y status checks
- Verificar que el PR tiene al menos 1 aprobación
- Verificar que todos los checks en verde en la pestaña Actions

### "Resource not accessible by integration" en release.yml

El `GITHUB_TOKEN` por defecto no puede crear releases si los permisos de Actions están en readonly.  
**Fix**: Ir a Settings → Actions → General → Workflow permissions → "Read and write permissions"

### Tests fallan en CI con "No binary for ChromeHeadless"

GitHub Actions Ubuntu incluye Chrome, pero si hay un fallo, añadir este paso antes de los tests:
```yaml
- name: Install Chrome
  uses: browser-actions/setup-chrome@latest
```

### semantic-release no genera release

- Verificar que hay al menos un commit `feat:` o `fix:` desde el último tag
- Verificar que el commit está en `master` (no en develop)
- `chore:`, `docs:`, `style:` no generan release

---

## 📊 Estado inicial esperado

Después de configurar todo y mergear el primer PR:

| Check | Estado esperado |
|---|---|
| Workflows activos | ✅ 8 workflows visibles en Actions |
| Branch protection develop | ✅ Requiere aprobación + CI |
| Branch protection master | ✅ Requiere aprobación + CI |
| Auto-merge develop | ✅ Activo en PRs aprobados |
| Auto-merge master | ✅ Activo en PRs develop→master aprobados |
| Releases automáticas | ✅ En cada push a master con feat/fix |
| Limpieza de ramas | ✅ Tras cada merge |
