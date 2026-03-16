# Landing Page - Imagen de Fondo Dinámica

## Resumen de Cambios

Se ha actualizado la landing page (init-page) para que tenga un diseño de hero full-screen con imagen de fondo dinámica, similar a diseños modernos tipo "VISAGE" (ver imagen de referencia).

## Características Implementadas

### 1. Hero Full-Screen
- Imagen de fondo a pantalla completa
- Overlay oscuro con gradiente para mejorar la legibilidad
- Contenido centrado vertical y horizontalmente
- Diseño responsive

### 2. Contenido del Hero
- **Título principal**: Grande, prominente, en mayúsculas (h1)
- **Subtítulo**: Descripción clara y concisa
- **Botones de acción**:
  - "Saber más" (outlined) → navega a /about
  - "Registrarse" (primary con glow) → navega a /register

### 3. Imagen de Fondo Dinámica (Preparada para Backend)

#### Estado Actual
- La imagen de fondo está hardcoded en el componente:
```typescript
heroBackgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop';
```

#### Implementación Futura (Backend)

##### Paso 1: Crear modelo en el backend
```java
// HeroSettings.java
@Entity
public class HeroSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String backgroundImageUrl;
    private LocalDateTime updatedAt;
    
    // getters, setters
}
```

##### Paso 2: Crear endpoint en el backend
```java
// HeroSettingsController.java
@RestController
@RequestMapping("/api/settings/hero")
public class HeroSettingsController {
    
    @GetMapping("/background")
    public ResponseEntity<HeroBackgroundDTO> getHeroBackground() {
        // Retorna la URL de la imagen de fondo actual
        return ResponseEntity.ok(heroSettingsService.getBackgroundImage());
    }
    
    @PutMapping("/background")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HeroBackgroundDTO> updateHeroBackground(
        @RequestBody HeroBackgroundDTO dto
    ) {
        // Actualiza la URL de la imagen de fondo
        return ResponseEntity.ok(heroSettingsService.updateBackgroundImage(dto));
    }
}
```

##### Paso 3: Crear servicio en el frontend
```typescript
// src/app/services/settings-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HeroSettings {
  backgroundImageUrl: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = `${environment.apiUrl}/api/settings`;

  constructor(private http: HttpClient) {}

  getHeroBackground(): Observable<HeroSettings> {
    return this.http.get<HeroSettings>(`${this.baseUrl}/hero/background`);
  }

  updateHeroBackground(imageUrl: string): Observable<HeroSettings> {
    return this.http.put<HeroSettings>(`${this.baseUrl}/hero/background`, {
      backgroundImageUrl: imageUrl
    });
  }
}
```

##### Paso 4: Actualizar el componente init-page
```typescript
// Descomentar y completar el código en init-page.ts
import { SettingsService } from '../../services/settings-service';

export class InitPage implements OnInit {
  heroBackgroundImage = ''; // URL por defecto vacía
  
  constructor(
    private lang: LanguageService,
    private router: Router,
    private settingsService: SettingsService  // Inyectar servicio
  ) {}

  async ngOnInit() {
    // ... código existente ...
    
    // Cargar imagen de fondo desde el backend
    this.loadHeroBackground();
  }

  private loadHeroBackground() {
    this.settingsService.getHeroBackground().subscribe({
      next: (settings) => {
        this.heroBackgroundImage = settings.backgroundImageUrl;
      },
      error: () => {
        // Fallback a imagen por defecto si hay error
        this.heroBackgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop';
      }
    });
  }
}
```

##### Paso 5: Panel de administración (opcional)
Crear una vista en el panel de admin para que los administradores puedan cambiar la imagen de fondo:
- Formulario con input de URL
- Vista previa de la imagen
- Botón de guardar que llama a `settingsService.updateHeroBackground()`

## Archivos Modificados

### Frontend
- `src/app/views/init-page/init-page.html` - Template con hero full-screen
- `src/app/views/init-page/init-page.ts` - Lógica del componente + placeholder para carga dinámica
- `src/app/views/init-page/init-page.css` - Estilos del hero full-screen
- `src/app/views/init-page/init-page.spec.ts` - Tests del componente (NUEVO)
- `src/assets/i18n/es.json` - Textos en español actualizados
- `src/assets/i18n/en.json` - Textos en inglés actualizados

## Traducciones

### Español
- Título: "Crea experiencias elegantes y visualizaciones únicas"
- Subtítulo: "Regístrate para obtener acceso prioritario a nuestra plataforma y lleva tus proyectos al siguiente nivel."
- Button1: "Registrarse"
- Button2: "Saber más"

### English
- Title: "Create elegant experiences and unique visualizations"
- Subtitle: "Sign up to gain priority access to our platform and take your projects to the next level."
- Button1: "Sign up"
- Button2: "Learn more"

## Tests

Se han creado 7 tests para el componente:
- ✅ Creación del componente
- ✅ Imagen de fondo por defecto
- ✅ Carga de traducciones en ngOnInit
- ✅ Navegación a /shop
- ✅ Navegación a /about
- ✅ Navegación a /contact
- ✅ Navegación a /register

Todos los tests pasan correctamente.

## Diseño Responsive

- Desktop: Hero full-screen, títulos grandes, botones en fila
- Mobile: 
  - Títulos ajustados (responsive font-sizing con clamp)
  - Botones en columna (flex-direction: column)
  - Background-attachment: scroll (mejor performance en móvil)

## TODO para integración con Backend

1. [ ] Crear entidad `HeroSettings` en el backend
2. [ ] Crear repository y service para `HeroSettings`
3. [ ] Crear endpoint GET `/api/settings/hero/background`
4. [ ] Crear endpoint PUT `/api/settings/hero/background` (solo admin)
5. [ ] Crear `SettingsService` en el frontend
6. [ ] Descomentar y completar método `loadHeroBackground()` en `init-page.ts`
7. [ ] (Opcional) Crear panel de administración para gestionar la imagen

## Notas

- La URL de la imagen actual es de Unsplash (imagen de montañas)
- Se recomienda usar un servicio de CDN para las imágenes de producción
- Las imágenes deben ser de alta resolución (mínimo 2000px de ancho)
- Formatos recomendados: WebP, JPEG optimizado
- Considerar lazy loading y progressive loading para mejor UX
