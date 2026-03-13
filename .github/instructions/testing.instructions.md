---
applyTo: "src/**/*.spec.ts"
---

# Testing — onlineshop-template (Karma + Jasmine)

## Tipos de test

| Tipo | Setup | Para qué |
|---|---|---|
| Unit (puro) | Plain Jasmine (`describe`/`it`) | Funciones puras, utilidades, reducers, selectores |
| Unit (servicio) | `TestBed` + `HttpClientTestingModule` | Servicios con HTTP |
| Componente | `TestBed` + `ComponentFixture` | Comportamiento del componente y template |
| Store | `provideMockStore` | Effects, selectores, integración de reducers |

---

## Estructura de archivos

Los tests van **en la misma carpeta** que el archivo que testean:

```
src/app/services/auth-service.ts          → auth-service.spec.ts
src/app/components/header/header.ts       → header.spec.ts
src/app/store/auth/auth.reducer.ts        → auth.reducer.spec.ts
src/app/store/cart/cart.selectors.ts      → cart.selectors.spec.ts
```

---

## Naming

```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should dispatch loginSuccessFinal when credentials are valid', () => { ... });
    it('should return error when credentials are invalid', () => { ... });
  });
});
```

Formato: **`should` + verbo** como descripción del test.

---

## Test de servicio con HTTP

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should return token on successful login', () => {
    service.login('user', 'pass').subscribe(res => {
      expect(res.token).toBeTruthy();
    });
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ token: 'abc123', user: { id: 1 } });
  });
});
```

---

## Test de componente

```typescript
describe('LoginCard', () => {
  let fixture: ComponentFixture<LoginCard>;
  let component: LoginCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCard],
      providers: [
        provideMockStore({ initialState: { auth: { user: null, loading: false, error: null } } })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show validation error when fields are empty', () => {
    component.onLogin();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-testid="validation-error"]');
    expect(error).toBeTruthy();
  });
});
```

---

## Test de reducer y selector

```typescript
describe('cartReducer', () => {
  it('should add item to cart', () => {
    const item: ProductCartItem = { id: 1, name: 'Test', price: 10, quantity: 1 };
    const state = cartReducer(initialState, addToCart({ item }));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe(1);
  });
});

describe('selectCartTotal', () => {
  it('should compute total from items', () => {
    const items: ProductCartItem[] = [{ id: 1, name: 'A', price: 10, quantity: 2 }];
    const result = selectCartTotal.projector(items);
    expect(result).toBe(20);
  });
});
```

---

## Reglas

- **SIEMPRE ejecutar `npm test -- --watch=false` antes de crear un PR** — debe pasar al 100%.
- Mockear todas las llamadas HTTP con `HttpClientTestingModule` — nunca tocar el backend real en tests.
- Mockear el Store con `provideMockStore` — nunca usar el store NgRx real en tests de componente.
- Tests en la misma carpeta que el archivo bajo test.
- **❌ NUNCA crear un componente, servicio o feature de store sin al menos un test**.
- No usar `TestBed` completo para tests unitarios de funciones puras — mantenerlos rápidos.

---

## Ejecutar tests

```bash
npm test                              # modo watch interactivo
npm test -- --watch=false             # ejecución única (CI / pre-PR)
npm test -- --include="**/auth*"      # patrón de archivo específico
```

---

## Reglas de negocio que deben tener tests obligatorios

- Cálculos del carrito (precio × cantidad = total)
- Transiciones de estado en el store (loading → success/failure)
- Guards de autenticación (redirige sin token, permite con token)
- Validación de formularios (campos vacíos, formato email, etc.)
- Interceptor JWT (añade header Authorization en requests autenticadas)
