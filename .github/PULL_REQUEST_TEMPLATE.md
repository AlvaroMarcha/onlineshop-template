## Descripción

<!-- Describe los cambios realizados en este PR -->

## Tipo de cambio

Selecciona el tipo de cambio que aplica (marca con [x]):

- [ ] `feat`: Nueva funcionalidad
- [ ] `fix`: Corrección de bug
- [ ] `refactor`: Refactorización de código sin cambios funcionales
- [ ] `perf`: Mejora de rendimiento
- [ ] `test`: Añadir o modificar tests
- [ ] `docs`: Cambios en documentación
- [ ] `style`: Cambios de formato (no afectan la lógica)
- [ ] `chore`: Cambios en build, CI/CD, o tareas de mantenimiento

## Checklist

Antes de solicitar revisión, verifica lo siguiente:

- [ ] No hay errores de compilación (`npm run build`)
- [ ] Todos los tests pasan localmente (`npm test -- --watch=false`)
- [ ] El título del PR sigue [Conventional Commits](https://www.conventionalcommits.org/): `tipo(scope opcional): descripción en español`
- [ ] Textos nuevos tienen claves i18n en `es.json` **Y** `en.json`
- [ ] Servicios nuevos usan `providedIn: 'root'` (patrón singleton — nunca `providers: []` en componente)
- [ ] Componentes nuevos usan `standalone: true` y `ChangeDetectionStrategy.OnPush`
- [ ] No hay `console.log` ni tipos `any` en el código
- [ ] He añadido tests para cubrir los cambios (si aplica)
- [ ] El PR tiene menos de 1000 líneas de código (o está justificado)
- [ ] He revisado mi propio código antes de solicitar revisión

## Contexto adicional

<!-- Información adicional que pueda ayudar a los revisores -->

## Issues relacionados

<!-- Menciona issues que este PR cierra o está relacionado -->

Closes #
Related to #

---

**Este PR se mergeará automáticamente al recibir aprobación y pasar todos los checks de CI.**
