import { routes } from './app.routes';
import { Route } from '@angular/router';

describe('app.routes', () => {
  const findRoute = (path: string): Route | undefined =>
    routes.find((r) => r.path === path);

  const findChild = (parentPath: string, childPath: string): Route | undefined => {
    const parent = findRoute(parentPath);
    return parent?.children?.find((c) => c.path === childPath);
  };

  describe('ruta /admin (BackOffice shell)', () => {
    it('debe usar loadComponent (lazy loading)', () => {
      const route = findRoute('admin');
      expect(route).toBeDefined();
      expect(route!.loadComponent).toBeDefined();
      expect(route!.component).toBeUndefined();
    });

    it('debe estar protegida con adminGuard', () => {
      const route = findRoute('admin');
      expect(route!.canActivate).toBeDefined();
      expect(route!.canActivate!.length).toBeGreaterThan(0);
    });

    it('debe tener children definidos', () => {
      const route = findRoute('admin');
      expect(route!.children).toBeDefined();
      expect(route!.children!.length).toBeGreaterThan(0);
    });

    it('debe redirigir /admin a /admin/dashboard por defecto', () => {
      const child = findChild('admin', '');
      expect(child).toBeDefined();
      expect(child!.redirectTo).toBe('dashboard');
    });
  });

  describe('children de /admin', () => {
    const adminChildren = [
      'dashboard',
      'products',
      'products/new',
      'products/:id',
      'categories',
      'attributes',
      'orders',
      'orders/:id',
      'users',
      'users/:id',
      'invoices',
      'invoices/:number',
      'inventory',
      'inventory/:productId',
    ];

    adminChildren.forEach((childPath) => {
      it(`debe tener la ruta child "${childPath}" con loadComponent`, () => {
        const child = findChild('admin', childPath);
        expect(child).toBeDefined();
        expect(child!.loadComponent).toBeDefined();
      });
    });
  });

  describe('ruta /profile', () => {
    it('debe usar loadComponent (lazy loading)', () => {
      const route = findRoute('profile');
      expect(route).toBeDefined();
      expect(route!.loadComponent).toBeDefined();
      expect(route!.component).toBeUndefined();
    });

    it('debe estar protegida con authGuard', () => {
      const route = findRoute('profile');
      expect(route!.canActivate).toBeDefined();
      expect(route!.canActivate!.length).toBeGreaterThan(0);
    });
  });

  describe('ruta wildcard 404', () => {
    it('debe existir la ruta ** para NotFound', () => {
      const route = findRoute('**');
      expect(route).toBeDefined();
      expect(route!.component).toBeDefined();
    });
  });
});
