import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSidebar } from './admin-sidebar';
import { selectUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../type/types';

function makeUser(roleName: string): User {
  return {
    id: 1, name: 'Test', surname: 'User', username: 'test',
    email: 't@t.com', phone: '600', roleName,
    profileImageUrl: '', createdAt: '', active: true, verified: true, addresses: [],
  };
}

describe('AdminSidebar', () => {
  let component: AdminSidebar;
  let fixture: ComponentFixture<AdminSidebar>;
  let store: MockStore;

  const initialAuthState = {
    auth: { token: null, user: null, loading: false, error: null, refreshToken: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebar, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState: initialAuthState }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AdminSidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show all 8 items for ROLE_ADMIN', () => {
    store.overrideSelector(selectUser, makeUser('ROLE_ADMIN'));
    store.refreshState();
    fixture.detectChanges();

    expect(component.visibleItems().length).toBe(8);
  });

  it('should show all 8 items for ROLE_SUPER_ADMIN', () => {
    store.overrideSelector(selectUser, makeUser('ROLE_SUPER_ADMIN'));
    store.refreshState();
    fixture.detectChanges();

    expect(component.visibleItems().length).toBe(8);
  });

  it('should hide dashboard and orders for ROLE_STORE', () => {
    store.overrideSelector(selectUser, makeUser('ROLE_STORE'));
    store.refreshState();
    fixture.detectChanges();

    const routes = component.visibleItems().map(i => i.route);
    expect(routes).not.toContain('/admin/dashboard');
    expect(routes).not.toContain('/admin/orders');
    expect(routes).toContain('/admin/products');
    expect(routes).toContain('/admin/inventory');
  });

  it('should show only orders-related items for ROLE_ORDERS', () => {
    store.overrideSelector(selectUser, makeUser('ROLE_ORDERS'));
    store.refreshState();
    fixture.detectChanges();

    const routes = component.visibleItems().map(i => i.route);
    expect(routes).toContain('/admin/orders');
    expect(routes).not.toContain('/admin/products');
    expect(routes).not.toContain('/admin/dashboard');
  });

  it('should return empty items for ROLE_USER', () => {
    store.overrideSelector(selectUser, makeUser('ROLE_USER'));
    store.refreshState();
    fixture.detectChanges();

    expect(component.visibleItems().length).toBe(0);
  });
});
