import { routes } from './app.routes';
import { Route } from '@angular/router';

describe('app.routes', () => {
  const findRoute = (path: string): Route | undefined =>
    routes.find((r) => r.path === path);

  describe('admin/dashboard', () => {
    it('should use loadComponent (lazy loading)', () => {
      const route = findRoute('admin/dashboard');
      expect(route).toBeDefined();
      expect(route!.loadComponent).toBeDefined();
      expect(route!.component).toBeUndefined();
    });

    it('should have authGuard', () => {
      const route = findRoute('admin/dashboard');
      expect(route!.canActivate).toBeDefined();
      expect(route!.canActivate!.length).toBeGreaterThan(0);
    });
  });

  describe('profile', () => {
    it('should use loadComponent (lazy loading)', () => {
      const route = findRoute('profile');
      expect(route).toBeDefined();
      expect(route!.loadComponent).toBeDefined();
      expect(route!.component).toBeUndefined();
    });

    it('should have authGuard', () => {
      const route = findRoute('profile');
      expect(route!.canActivate).toBeDefined();
      expect(route!.canActivate!.length).toBeGreaterThan(0);
    });
  });
});
