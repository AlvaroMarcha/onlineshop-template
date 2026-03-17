import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { selectUser } from '../../../store/auth/auth.selectors';
import { selectOrderStats, selectDashboardLoading } from '../../../store/admin/dashboard/dashboard.selectors';
import { User } from '../../../type/types';
import { OrderStatus } from '../../../type/admin-types';

const INITIAL_STATE = {
  auth: { token: null, user: null, loading: false, error: null, refreshToken: null },
  dashboard: {
    revenue: null, revenueChart: null, conversionRate: null, averageOrderValue: null,
    orderStats: null, userStats: null, topSellingProducts: [], lowStockProducts: [],
    pendingOrders: [], recentInvoices: [], todayOrdersSummary: null, orderQueue: [],
    pendingRefunds: [], delayedShipments: [], productSummary: null,
    mostViewedProducts: [], bestRatedProducts: [], recentReviews: [],
    newCustomers: [], topBuyers: [], bannedCustomers: [], customerRetention: null,
    ordersWithIssues: [], loading: false, error: null,
  },
};

function makeUser(roleName: string): User {
  return {
    id: 1, name: 'Test', surname: 'User', username: 'test',
    email: 't@t.com', phone: '600', roleName,
    profileImageUrl: '', createdAt: '', active: true, verified: true, addresses: [],
  };
}

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;
  let store: MockStore;

  const setup = async (user: User | null) => {
    await TestBed.configureTestingModule({
      imports: [
        Dashboard,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectUser, user);
    store.overrideSelector(selectOrderStats, null);
    store.overrideSelector(selectDashboardLoading, false);
    store.refreshState();

    fixture   = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create with null user', async () => {
    await setup(null);
    expect(component).toBeTruthy();
  });

  it('should create with ROLE_ADMIN user', async () => {
    await setup(makeUser('ROLE_ADMIN'));
    expect(component.isAdmin()).toBeTrue();
    expect(component.isSuperAdmin()).toBeFalse();
  });

  it('should create with ROLE_SUPER_ADMIN user', async () => {
    await setup(makeUser('ROLE_SUPER_ADMIN'));
    expect(component.isSuperAdmin()).toBeTrue();
    expect(component.isAdmin()).toBeTrue();
  });

  it('should detect ORDERS role', async () => {
    await setup(makeUser('ROLE_ORDERS'));
    expect(component.isOrders()).toBeTrue();
    expect(component.isAdmin()).toBeFalse();
  });

  it('should detect STORE role', async () => {
    await setup(makeUser('ROLE_STORE'));
    expect(component.isStore()).toBeTrue();
  });

  it('should detect SUPPORT role', async () => {
    await setup(makeUser('ROLE_SUPPORT'));
    expect(component.isSupport()).toBeTrue();
  });

  it('orderStatusSeverity should map DELIVERED to success', async () => {
    await setup(null);
    expect(component.orderStatusSeverity(OrderStatus.DELIVERED)).toBe('success');
  });

  it('orderStatusSeverity should map CANCELLED to danger', async () => {
    await setup(null);
    expect(component.orderStatusSeverity(OrderStatus.CANCELLED)).toBe('danger');
  });
});
