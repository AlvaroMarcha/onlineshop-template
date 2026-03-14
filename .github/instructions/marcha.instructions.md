---
applyTo: "src/app/components/marcha/**"
---

# Marcha UI — Glassmorphism Design System

> Sistema de componentes propietario con estética glassmorphism. Los componentes tienen prefijo `M` y se organizan en `src/app/components/marcha/`.

---

## Filosofía del sistema

**Marcha UI** es un design system standalone que implementa:
- **Glassmorphism**: backgrounds translúcidos con `backdrop-filter: blur()`
- **OnPush + Signals**: `ChangeDetectionStrategy.OnPush` obligatorio, señales para reactivity
- **Standalone components**: sin NgModules, 100% standalone
- **CSS custom properties**: variables de tema (`--m-*`) para colores y espaciado
- **Reutilizable**: cada componente es autocontenido e importable individualmente

---

## Estructura de archivos

Cada componente Marcha UI sigue **estrictamente** este patrón:

```
src/app/components/marcha/
├── m-button/
│   ├── m-button.ts        // Componente + tipos exportados
│   ├── m-button.html      // Template
│   ├── m-button.css       // Estilos (CSS custom properties)
│   └── m-button.spec.ts   // Tests unitarios (Jasmine)
├── m-card/
│   └── ... (misma estructura)
└── index.ts               // Barrel export de TODOS los componentes
```

**Reglas obligatorias:**
- 4 archivos por componente: `.ts` + `.html` + `.css` + `.spec.ts`
- Nombre de archivo: `kebab-case` (ej: `m-toggle-button.ts`)
- Clase del componente: `PascalCase` (ej: `export class MToggleButton`)
- Selector: `kebab-case` con prefijo `m-` (ej: `selector: 'm-toggle-button'`)
- Todo se exporta desde `index.ts` (barrel)

---

## Naming conventions

| Elemento | Formato | Ejemplo |
|---|---|---|
| Archivo | `m-<nombre>.ts` | `m-button.ts` |
| Clase component | `M<Nombre>` | `MButton` |
| Selector | `m-<nombre>` | `m-button` |
| Tipo exportado | `M<Nombre><Subtipo>` | `MButtonSeverity`, `MTableColumn` |
| CSS class raíz | `.m-<nombre>` | `.m-button` |
| CSS class elemento BEM | `.m-<nombre>__<elemento>` | `.m-button__icon` |
| CSS class modifier BEM | `.m-<nombre>--<modifier>` | `.m-button--large` |
| CSS state | `.is-<state>` | `.is-active`, `.is-disabled`, `.is-open` |

---

## Plantilla base de componente

```typescript
import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

export type MSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger';
export type MSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'm-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* otros componentes Marcha si los necesita */],
  templateUrl: './m-example.html',
  styleUrl: './m-example.css',
})
export class MExample {
  // Inputs (señales readonly)
  readonly label    = input('');
  readonly severity = input<MSeverity>('primary');
  readonly size     = input<MSize>('md');
  readonly disabled = input(false);

  // Outputs
  readonly click = output<void>();

  // Estado interno (señales writable)
  readonly _isActive = signal(false);

  // Computed (derivado de otras señales)
  readonly cssClass = computed(() => 
    `m-example m-example--${this.severity()} m-example--${this.size()}` +
    (this.disabled() ? ' is-disabled' : '') +
    (this._isActive() ? ' is-active' : '')
  );

  onClick(): void {
    if (this.disabled()) return;
    this._isActive.update(v => !v);
    this.click.emit();
  }
}
```

**HTML mínimo:**
```html
<button 
  [class]="cssClass()" 
  [disabled]="disabled() || null"
  (click)="onClick()"
>
  {{ label() }}
</button>
```

---

## CSS custom properties (variables de tema)

Todos los componentes Marcha usan estas variables definidas en `src/styles.css`:

```css
/* Colores principales */
--m-primary: #6366f1;           /* Indigo 500 */
--m-secondary: #64748b;         /* Slate 500 */
--m-success: #10b981;           /* Emerald 500 */
--m-warn: #f59e0b;              /* Amber 500 */
--m-danger: #ef4444;            /* Red 500 */

/* Texto */
--m-text: #1e293b;              /* Slate 800 (light mode) */
--m-text-muted: #64748b;        /* Slate 500 */

/* Backgrounds glassmorphism */
--m-glass-bg: rgba(255,255,255,.7);
--m-glass-border: rgba(0,0,0,.1);
--m-blur: 12px;
--m-secondary-bg: rgba(241,245,249,.8);  /* Slate 50 translúcido */

/* Espaciado y bordes */
--m-radius-sm: 0.25rem;         /* 4px */
--m-radius-md: 0.5rem;          /* 8px */
--m-radius-lg: 0.75rem;         /* 12px */
--m-radius-xl: 1rem;            /* 16px */

/* Tipografía */
--m-font: 'Inter', system-ui, sans-serif;
```

**Dark mode**: las variables se redefinen en `.my-app-dark` (ver `src/styles.css`).

---

## Componentes disponibles

### Primitivos

#### `MButton`
```typescript
<m-button 
  label="Aceptar"
  icon="lucide:check"
  severity="primary"  // primary · secondary · success · warn · danger
  variant="filled"    // filled · outline · text · ghost
  size="md"           // sm · md · lg
  [disabled]="false"
  (click)="onAccept()"
/>
```

#### `MCard`
```typescript
<m-card header="Título" variant="glass" padding="lg">
  <p>Contenido del card con glassmorphism</p>
</m-card>
```

#### `MIcon`
```typescript
<m-icon icon="lucide:heart" size="20" color="#ef4444" />
```
Usa Iconify para iconos. Formato: `{collection}:{name}` (ej: `lucide:settings`).

---

### Formularios

#### `MInput`
```typescript
<m-input 
  [formControl]="nameCtrl"
  placeholder="Nombre"
  icon="lucide:user"
  [disabled]="false"
/>
```
ControlValueAccessor compatible con Reactive Forms.

#### `MCheckbox`
```typescript
<m-checkbox 
  [formControl]="acceptCtrl"
  label="Acepto los términos"
/>
```

#### `MSelect`
```typescript
<m-select
  [formControl]="cityCtrl"
  [options]="cities"
  placeholder="Selecciona ciudad"
/>
```
Donde `cities: MSelectOption[] = [{ label: 'Madrid', value: 'mad' }, ...]`.

#### `MToggleButton` (nuevo)
```typescript
<m-toggle-button
  [formControl]="boldCtrl"
  icon="lucide:bold"
  severity="primary"
  size="md"
/>
```
Toggle reutilizable con ControlValueAccessor (valor: `boolean`).

---

### Navegación

#### `MMenubar` (nuevo) ⭐
```typescript
readonly items: MMenubarItem[] = [
  { 
    label: 'Archivo', 
    icon: 'lucide:folder',
    items: [
      { label: 'Nuevo', icon: 'lucide:file-plus' },
      { divider: true },
      { label: 'Guardar', icon: 'lucide:save' },
    ],
  },
  { label: 'Editar', icon: 'lucide:edit' },
];

// Island mode (width: fit-content)
<m-menubar [items]="items" (itemClick)="onMenuClick($event)" />

// Bar mode (full-width header con logo)
<m-menubar
  logo="Mi App"
  logoIcon="lucide:layers"
  [items]="items"
  [contained]="true"
  maxWidth="1280px"
  (itemClick)="onMenuClick($event)"
  (logoClick)="onLogoClick()"
>
  <!-- Slot derecho para acciones -->
  <m-button icon="lucide:user" variant="text" />
</m-menubar>
```

**Props clave:**
- `[fullWidth]="true"` → barra 100% ancho sin border-radius (modo header)
- `[contained]="true"` → inner centrado con max-width (navbar estilo web moderna)
- `logo` + `logoIcon` → logo en lado izquierdo con gradient text + glow icon
- `<ng-content />` → slot derecho para botones de acción
- **Mobile responsive**: hamburger → X animado, panel accordion

**Features técnicas:**
- Dropdown desktop con accent bar hover
- Mobile accordion con chevron rotate
- `host: { '[style.display]': '"block"' }` para que funcione `width: 100%`
- CSS burger → X: `translateY(5.5px) rotate(45deg)` (matemática: bars 1.5px + gap 4px)
- Gradient accent bottom line en modo bar
- 17 tests: desktop dropdowns + mobile panel + document click outside

---

### Overlays

#### `MDialog`
```typescript
<m-dialog [(visible)]="showDialog" header="Título" size="md">
  <p>Contenido del diálogo</p>
</m-dialog>
```

#### `MDrawer`
```typescript
<m-drawer [(open)]="showDrawer" position="right">
  <nav>Enlaces...</nav>
</m-drawer>
```

---

### Layout

#### `MTabs`
```typescript
readonly tabs: MTabItem[] = [
  { label: 'General', icon: 'lucide:settings' },
  { label: 'Perfil', icon: 'lucide:user' },
];

<m-tabs [items]="tabs" [(active)]="activeTab">
  <m-tab-panel [index]="0">Contenido General</m-tab-panel>
  <m-tab-panel [index]="1">Contenido Perfil</m-tab-panel>
</m-tabs>
```

#### `MAccordion`
```typescript
<m-accordion [items]="accordionItems" />
```

---

### Utilidades

#### `MToggleSwitch`
```typescript
<m-toggle-switch 
  [formControl]="darkModeCtrl"
  label="Modo oscuro"
  size="md"
/>
```

#### `MCopy`
```typescript
<m-copy [text]="apiKey" />
```
Copia el texto al portapapeles y muestra feedback visual.

#### `MSortable`
```typescript
<m-sortable 
  [items]="tasks"
  (orderChange)="onReorder($event)"
/>
```
Drag & drop nativo para reordenar listas.

---

## Patrones de implementación

### ControlValueAccessor (CVA)

Para inputs que deben funcionar con Reactive Forms:

```typescript
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'm-custom-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MCustomInput),
    multi: true,
  }],
  // ...
})
export class MCustomInput implements ControlValueAccessor {
  readonly value = signal<string>('');
  readonly isDisabled = signal(false);

  private onChange = (v: string) => {};
  private onTouched = () => {};

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(newValue: string): void {
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}
```

### Computed Class (patrón cssClass)

Centralizar clases CSS dinámicas en un `computed()`:

```typescript
readonly cssClass = computed(() => {
  const classes = ['m-component'];
  classes.push(`m-component--${this.variant()}`);
  if (this.disabled()) classes.push('is-disabled');
  if (this._isOpen()) classes.push('is-open');
  return classes.join(' ');
});

// En HTML
<div [class]="cssClass()">...</div>
```

### Document click outside

Para cerrar dropdowns/modales al hacer click fuera:

```typescript
@HostListener('document:click', ['$event'])
onDocClick(e: Event): void {
  if (!(e.target as Element).closest?.('m-dropdown')) {
    this._isOpen.set(false);
  }
}
```

### Animaciones CSS

Preferir CSS animations sobre Angular animations:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.m-dropdown {
  animation: fadeIn .15s ease;
}
```

---

## Testing

Cada componente **debe** tener tests unitarios (Jasmine + Karma).

### Template base de test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MExample } from './m-example';

describe('MExample', () => {
  let fixture: ComponentFixture<MExample>;
  let component: MExample;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ 
      imports: [MExample] 
    }).compileComponents();
    
    fixture = TestBed.createComponent(MExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('severity input defaults to primary', () => {
    expect(component.severity()).toBe('primary');
  });

  it('clicking button emits click event', () => {
    const spy = jasmine.createSpy('click');
    component.click.subscribe(spy);
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('disabled button does not emit click', () => {
    const spy = jasmine.createSpy('click');
    component.click.subscribe(spy);
    fixture.componentRef.setInput('disabled', true);
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });
});
```

### Testing CVA components

```typescript
it('writeValue sets the internal value', () => {
  component.writeValue('test');
  expect(component.value()).toBe('test');
});

it('writeValue handles null', () => {
  component.writeValue(null);
  expect(component.value()).toBe('');
});

it('onChange callback is called on input', () => {
  const spy = jasmine.createSpy('onChange');
  component.registerOnChange(spy);
  component.onInput('new value');
  expect(spy).toHaveBeenCalledWith('new value');
});

it('setDisabledState updates disabled signal', () => {
  component.setDisabledState(true);
  expect(component.isDisabled()).toBeTrue();
});
```

### Testing signals y computed

```typescript
it('cssClass includes severity modifier', () => {
  fixture.componentRef.setInput('severity', 'success');
  expect(component.cssClass()).toContain('m-example--success');
});

it('cssClass adds is-disabled when disabled', () => {
  fixture.componentRef.setInput('disabled', true);
  expect(component.cssClass()).toContain('is-disabled');
});

it('updating signal triggers computed', () => {
  component._isActive.set(false);
  expect(component.cssClass()).not.toContain('is-active');
  component._isActive.set(true);
  expect(component.cssClass()).toContain('is-active');
});
```

---

## Crear un nuevo componente Marcha

### Flujo de trabajo (3 fases)

Cuando creas un componente nuevo, seguir **siempre** este flujo:

**FASE 1 — Modelo** (1 commit/PR)
1. Crear carpeta `src/app/components/marcha/m-<nombre>/`
2. Crear `.ts`: tipos, interfaces, inputs, outputs, signals
3. Crear `.html`: structure básica (sin estilos)
4. Crear `.css`: esqueleto vacío con comentarios de secciones
5. Crear `.spec.ts`: tests de existencia y props básicas
6. Exportar desde `index.ts`
7. **Tests obligatorios** (mínimo: create + inputs defaults)

**FASE 2 — Lógica** (1 commit/PR)
1. Implementar métodos del componente
2. Implementar computed classes
3. Implementar event handlers
4. Añadir CVA si aplica
5. **Tests obligatorios** (métodos, eventos, CVA pattern)

**FASE 3 — Presentación** (1 commit/PR)
1. Escribir CSS completo con glassmorphism
2. Integrar en demo page (`src/app/views/demo/`)
3. Añadir i18n keys si necesita labels
4. **Tests obligatorios** (interacción, estados, responsive)

**Cada fase en PR separado** — idealmente < 900 líneas, máximo 1000.

### Checklist de completitud

Antes de marcar un componente como completo:

- [ ] 4 archivos creados: `.ts` + `.html` + `.css` + `.spec.ts`
- [ ] Exportado desde `index.ts`
- [ ] Usa `ChangeDetectionStrategy.OnPush`
- [ ] Usa `standalone: true`
- [ ] Todas las props son signals (`input()`, `output()`, `signal()`)
- [ ] Computed `cssClass` si tiene variantes
- [ ] Variables CSS (`--m-*`) en lugar de valores hardcodeados
- [ ] Tests cubren: create, inputs, outputs, estados, CVA (si aplica)
- [ ] Demo integrado en `/demo` con al menos 2 variantes
- [ ] Código en inglés, comentarios complejos en español
- [ ] Sin `console.log` ni código debug
- [ ] Build pasa: `ng build --configuration development`
- [ ] Tests pasan: `ng test --watch=false --browsers=ChromeHeadless`

---

## Reglas de estilo CSS

### BEM naming

```css
/* Bloque raíz */
.m-button { }

/* Elementos (hijo directo lógico) */
.m-button__icon { }
.m-button__label { }

/* Modificadores (variantes) */
.m-button--large { }
.m-button--primary { }

/* Estados (temporal) */
.m-button.is-active { }
.m-button.is-disabled { }
```

### Glassmorphism base

```css
.m-component {
  background: var(--m-glass-bg);
  backdrop-filter: blur(var(--m-blur));
  -webkit-backdrop-filter: blur(var(--m-blur));
  border: 1px solid var(--m-glass-border);
  border-radius: var(--m-radius-md);
}
```

### Transitions suaves

```css
.m-component {
  transition: background .15s ease, color .15s ease, transform .2s ease;
}

.m-component:hover {
  background: var(--m-secondary-bg);
  transform: translateY(-1px);
}
```

### Responsive

Desktop-first para Marcha (a diferencia de Tailwind mobile-first):

```css
/* Desktop */
.m-menubar__nav { display: flex; }
.m-menubar__burger { display: none; }

/* Mobile */
@media (max-width: 768px) {
  .m-menubar__nav { display: none; }
  .m-menubar__burger { display: flex; }
}
```

---

## Integración con el resto del proyecto

### Importar componentes Marcha

```typescript
// ✅ Desde el barrel (preferido)
import { MButton, MCard, MIcon } from '@/components/marcha';

// ❌ Import directo (evitar)
import { MButton } from '@/components/marcha/m-button/m-button';
```

### Usar con Reactive Forms

```typescript
readonly form = new FormGroup({
  name: new FormControl('', Validators.required),
  accept: new FormControl(false),
});

// En template
<m-input [formControl]="form.controls.name" />
<m-checkbox [formControl]="form.controls.accept" />
```

### Mixing con PrimeNG

Evitar mezclar componentes Marcha con PrimeNG en el mismo contexto visual. Si es necesario:

```html
<!-- ✅ Separados en secciones distintas -->
<m-card>
  <m-button label="Acción Marcha" />
</m-card>

<p-panel header="Panel PrimeNG">
  <p-button label="Acción PrimeNG" />
</p-panel>

<!-- ❌ Mezclados en mismo contenedor -->
<div>
  <m-button />
  <p-button />  <!-- Estilos inconsistentes -->
</div>
```

---

## Variables de entorno y configuración

Si un componente necesita configuración global (ej: API keys, URLs):

```typescript
// src/environments/environment.ts
export const environment = {
  iconifyAPI: 'https://api.iconify.design',
  marchaPrimaryColor: '#6366f1',
};

// En el componente
import { environment } from '@/environments/environment';
```

---

## Troubleshooting común

### "NG0301: Export not found"
- Revisar que el componente está exportado en `index.ts`
- Verificar que el import usa el barrel: `from '@/components/marcha'`

### Glassmorphism no se ve
- Verificar que hay contenido detrás (background)
- Asegurar que `backdrop-filter` está aplicado
- Comprobar que `--m-glass-bg` tiene alpha < 1

### Signals no actualizan la vista
- Verificar que el componente usa `ChangeDetectionStrategy.OnPush`
- Asegurar que estás usando `signal.set()` o `signal.update()`, no mutación directa
- Llamar `fixture.detectChanges()` en tests

### Tests fallan en CI pero pasan local
- Asegurar que usas `ChromeHeadless` en tests
- Verificar que no hay `console.log` (algunos CI fallan por warnings)
- Comprobar timeouts en operaciones async

---

## Recursos

- **Iconify**: https://icon-sets.iconify.design/ (buscar iconos)
- **CSS Variables**: `src/styles.css` (todas las variables del tema)
- **Demo live**: `http://localhost:4200/demo` (después de `ng serve`)
- **Angular Signals**: https://angular.dev/guide/signals

---

## Contribución

Al crear un nuevo componente Marcha:
1. Seguir el flujo de 3 fases (modelo → lógica → presentación)
2. Crear PRs pequeños (< 900 líneas ideal, < 1000 máximo)
3. Tests obligatorios en cada fase
4. Demo integrado en `/demo`
5. Conventional commits: `feat(marcha): añadir m-<nombre>`
6. Obtener aprobación manual antes de merge
