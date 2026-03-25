import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersAdmin } from './orders';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import {
  selectAdminOrders,
  selectAdminOrderLoading,
  selectAdminOrderError,
} from '../../../store/admin/orders/admin-order.selectors';
import {
  adminOrdersSearch,
  adminOrdersSetPage,
} from '../../../store/admin/orders/admin-order.actions';
import { OrderAdmin, OrderStatus, PaymentStatus, Page } from '../../../type/admin-types';

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
  adminProducts: {
    page: null, selected: null, attribs: [],
    searchParams: { page: 0, size: 20, includeInactive: true },
    loading: false, saving: false, error: null,
  },
  catalog: { categories: [], loading: false, saving: false, toggling: false, error: null },
  orders: {
    orders: null, selected: null,
    searchParams: { page: 0, size: 20 },
    loading: false, detailLoading: false, saving: false, error: null,
  },
};

const MOCK_ORDER: OrderAdmin = {
  id: 1,
  userId: 5,
  status: OrderStatus.PAID,
  totalAmount: 99.99,
  discountAmount: 0,
  couponCode: null,
  paymentMethod: 'stripe',
  createdAt: '2024-01-15T10:30:00',
  payments: [{
    id: 10, orderId: 1, status: PaymentStatus.SUCCESS,
    amount: 99.99, provider: 'stripe', transactionId: 'pi_test', createdAt: '2024-01-15T10:30:00',
  }],
  address: {
    addressLine1: 'Calle Mayor 1', addressLine2: null,
    country: 'ES', city: 'Madrid', postalCode: '28001',
  },
  orderItems: [
    {
      id: 1, productId: 10, name: 'Producto A', sku: 'SKU-010',
      price: 99.99, discountPrice: null, quantity: 1,
      taxRate: 21, weight: 0.5, isDigital: false, isFeatured: false,
    },
  ],
};

const MOCK_PAGE: Page<OrderAdmin> = {
  content: [MOCK_ORDER],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 20,
};

describe('OrdersAdmin', () => {
  let fixture: ComponentFixture<OrdersAdmin>;
  let component: OrdersAdmin;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersAdmin, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminOrders,      null);
    store.overrideSelector(selectAdminOrderLoading, false);
    store.overrideSelector(selectAdminOrderError,   null);
    store.refreshState();

    fixture   = TestBed.createComponent(OrdersAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('dispatches adminOrdersSearch on init', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminOrdersSearch.type })
      );
    });

    it('dispatches adminOrdersSetPage on init', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminOrdersSetPage.type })
      );
    });
  });

  describe('Signals', () => {
    it('allOrders() returns [] when page is null', () => {
      expect(component.allOrders()).toEqual([]);
    });

    it('orders() returns [] initially', () => {
      expect(component.orders()).toEqual([]);
    });

    it('total() returns 0 when no page loaded', () => {
      expect(component.total()).toBe(0);
    });

    it('loading() returns false initially', () => {
      expect(component.loading()).toBeFalse();
    });

    it('totalPages() is 0 when total is 0', () => {
      expect(component.totalPages()).toBe(0);
    });
  });

  describe('Filtros locales', () => {
    beforeEach(() => {
      store.overrideSelector(selectAdminOrders, MOCK_PAGE);
      store.refreshState();
      fixture.detectChanges();
    });

    it('orders() returns all orders when no filter applied', () => {
      expect(component.orders().length).toBe(1);
    });

    it('searchIdTerm filters by order id', () => {
      component.searchIdTerm.set('1');
      expect(component.orders().length).toBe(1);
      component.searchIdTerm.set('999');
      expect(component.orders().length).toBe(0);
    });

    it('statusFilter filters by status', () => {
      component.statusFilter.set(OrderStatus.PAID);
      expect(component.orders().length).toBe(1);
      component.statusFilter.set(OrderStatus.CANCELLED);
      expect(component.orders().length).toBe(0);
    });

    it('statusFilter "all" shows all orders', () => {
      component.statusFilter.set('all');
      expect(component.orders().length).toBe(1);
    });
  });

  describe('Paginación', () => {
    beforeEach(() => {
      const largePage: Page<OrderAdmin> = {
        content: [MOCK_ORDER],
        totalElements: 60,
        totalPages: 3,
        number: 0,
        size: 20,
      };
      store.overrideSelector(selectAdminOrders, largePage);
      store.refreshState();
      fixture.detectChanges();
    });

    it('totalPages() is 3 for 60 items with size 20', () => {
      expect(component.totalPages()).toBe(3);
    });

    it('prevPage() does nothing on first page', () => {
      component['pageIndex'].set(0);
      const spy = spyOn(store, 'dispatch');
      component.prevPage();
      expect(component['pageIndex']()).toBe(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('nextPage() advances page and dispatches', () => {
      component['pageIndex'].set(0);
      const spy = spyOn(store, 'dispatch');
      component.nextPage();
      expect(component['pageIndex']()).toBe(1);
      expect(spy).toHaveBeenCalled();
    });

    it('nextPage() does nothing on last page', () => {
      component['pageIndex'].set(2);
      const spy = spyOn(store, 'dispatch');
      component.nextPage();
      expect(component['pageIndex']()).toBe(2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('goToPage() sets pageIndex and dispatches', () => {
      const spy = spyOn(store, 'dispatch');
      component.goToPage(2);
      expect(component['pageIndex']()).toBe(2);
      expect(spy).toHaveBeenCalled();
    });

    it('prevPage() goes back from page 2', () => {
      component['pageIndex'].set(2);
      const spy = spyOn(store, 'dispatch');
      component.prevPage();
      expect(component['pageIndex']()).toBe(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onAction()', () => {
    it('navigates to order detail on "Ver" action', () => {
      const router = TestBed.inject(Router);
      const spy = spyOn(router, 'navigate');
      const mockAction = { label: 'Ver', icon: 'visibility', severity: 'info' as const };
      component.onAction({ action: mockAction, row: MOCK_ORDER as unknown as Record<string, unknown> });
      expect(spy).toHaveBeenCalledWith(['/admin/orders', MOCK_ORDER.id]);
    });
  });

  describe('statusSeverity()', () => {
    it('returns success for PAID', () => {
      expect(component.statusSeverity(OrderStatus.PAID)).toBe('success');
    });

    it('returns success for DELIVERED', () => {
      expect(component.statusSeverity(OrderStatus.DELIVERED)).toBe('success');
    });

    it('returns info for PROCESSING', () => {
      expect(component.statusSeverity(OrderStatus.PROCESSING)).toBe('info');
    });

    it('returns info for SHIPPED', () => {
      expect(component.statusSeverity(OrderStatus.SHIPPED)).toBe('info');
    });

    it('returns danger for CANCELLED', () => {
      expect(component.statusSeverity(OrderStatus.CANCELLED)).toBe('danger');
    });

    it('returns warn for RETURNED', () => {
      expect(component.statusSeverity(OrderStatus.RETURNED)).toBe('warn');
    });

    it('returns secondary for CREATED', () => {
      expect(component.statusSeverity(OrderStatus.CREATED)).toBe('secondary');
    });
  });

  describe('statusLabel()', () => {
    it('returns label for each status', () => {
      expect(component.statusLabel(OrderStatus.CREATED)).toBe('Creado');
      expect(component.statusLabel(OrderStatus.PAID)).toBe('Pagado');
      expect(component.statusLabel(OrderStatus.PROCESSING)).toBe('En proceso');
      expect(component.statusLabel(OrderStatus.SHIPPED)).toBe('Enviado');
      expect(component.statusLabel(OrderStatus.DELIVERED)).toBe('Entregado');
      expect(component.statusLabel(OrderStatus.CANCELLED)).toBe('Cancelado');
      expect(component.statusLabel(OrderStatus.RETURNED)).toBe('Devuelto');
    });
  });
});
