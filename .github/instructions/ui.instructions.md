---
applyTo: "src/app/**/*.html, src/app/**/*.css, src/styles.css"
---

# UI — PrimeNG + Tailwind CSS

## PrimeNG

- **Siempre importar `PrimengModule`** desde `src/app/shared/primeng/primeng-module.ts` — nunca importar módulos PrimeNG individuales directamente en componentes.
- Usar variables de tema PrimeNG para colores — nunca hardcodear hex/rgb.
- Los componentes PrimeNG usan prefijo `p-`: `<p-button>`, `<p-dialog>`, `<p-card>`.
- Labels y textos siempre enlazados con traducciones: `[label]="'key' | translate"` — nunca texto hardcodeado.

```typescript
// ✅ Correcto
imports: [PrimengModule, TranslateModule]

// ❌ Incorrecto — importa módulos individuales y bypasea el barrel
imports: [ButtonModule, DialogModule, TranslateModule]
```

---

## PrimeNG Toast (MessageService)

- `MessageService` está registrado en `app.config.ts` — inyectarlo sin añadirlo al `providers` del componente.
- El `<p-toast />` va únicamente en el `app.html` raíz — no en vistas ni componentes individuales.

```typescript
// ✅ Inyección correcta (singleton)
constructor(private msg: MessageService) {}

// Uso con traducción
const summary = await this.lang.tOne('global.success');
this.msg.add({ severity: 'success', summary });
```

---

## Tailwind CSS

- **Utility-first** — preferir clases Tailwind en templates sobre CSS de componente para layout y espaciado.
- **Mobile-first responsivo**: `base → md: → lg:` — los estilos base apuntan a móvil.
- No mezclar clases Tailwind con propiedades CSS inline en el mismo elemento cuando se pueda evitar.
- Patrones de layout habituales:

```html
<!-- Flex responsivo -->
<div class="flex flex-col md:flex-row gap-4">...</div>

<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>

<!-- Centrado -->
<div class="flex items-center justify-center min-h-screen">...</div>
```

---

## Dark mode

- Dark mode activado añadiendo la clase `.my-app-dark` al elemento `<html>`.
- Usar los tokens del tema PrimeNG que responden automáticamente a esta clase.
- Utilidad: `useDarkMode()` desde `src/app/shared/utils.ts`.
- ❌ No usar la variante `dark:` de Tailwind — usar el sistema de theming de PrimeNG.

---

## Global vs estilos de componente

| Dónde | Para qué |
|---|---|
| `src/styles.css` | Resets, utilidades globales (`.stl-button`), import de PrimeIcons |
| `<component>.css` | Overrides de layout específicos del componente no alcanzables con Tailwind |

Mantener el CSS de componente mínimo. Si Tailwind puede hacerlo, usar Tailwind.

---

## Reglas de responsive

- Todas las vistas deben ser usables en móvil (min-width: 360px).
- Puntos de referencia: 360px (móvil), 768px (tablet), 1280px (escritorio).
- Evitar anchos fijos — preferir `max-w-*`, `w-full`, `min-w-0`.
- Imágenes: siempre `width`/`height` o `w-full h-auto` para evitar layout shift.
- Texto truncado: usar `truncate` o `line-clamp-*` de Tailwind en lugar de CSS manual.

---

## Accesibilidad básica

- Todos los `<img>` deben tener atributo `alt`.
- Los botones sin texto visible deben tener `aria-label`.
- Usar elementos semánticos HTML5 (`<main>`, `<nav>`, `<section>`, `<article>`) en vistas.
- El contraste de color debe cumplir WCAG AA (4.5:1 para texto normal).
