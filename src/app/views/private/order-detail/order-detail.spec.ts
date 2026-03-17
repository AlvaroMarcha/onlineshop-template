import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetail } from './order-detail';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import {
  selectAdminOrderSelected,
  selectAdminOrderDetailLoading,
  selectAdminOrderSaving,
  selectAdminOrderError,
} from '../../../store/admin/orders/admin-order.selectors';
import {
  adminOrderLoad,
  adminOrderNextStatus,
  adminPaymentCancel,
  adminPaymentRefund,
} from '../../../store/admin/orders/admin-order.actions';
import { OrderAdmin, OrderStatus, PaymentAdmin, PaymentStatus } from '../../../type/admin-types';

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
  catalog: { categories: [], loading: false, saving: false, error: null },
  orders: {
    orders: null, selected: null,
    searchParams: { page: 0, size: 20 },
    loading: false, detailLoading: false, saving: false, error: null,
  },
};

const MOCK_PAYMENT: PaymentAdmin = {
  id: 10, orderId: 1, status: PaymentStatus.SUCCESS,
  amount: 99.99, provider: 'stripe', transactionId: 'pi_test', createdAt: '2024-01-15T10:30:00',
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
  payments: [MOCK_PAYMENT],
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

function makeRoute(id: string | null) {
  return { snapshot: { paramMap: { get: () => id } } };
}

describe('OrderDetail', () => {
  let fixture: ComponentFixture<OrderDetail>;
  let component: OrderDetail;
  let store: MockStore;

  const setup = async (routeId: string | null = '1') => {
    await TestBed.configureTestingModule({
      imports: [OrderDetail, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
        { provide: ActivatedRoute, useValue: makeRoute(routeId) },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminOrderSelected,     null);
    store.overrideSelector(selectAdminOrderDetailLoading, false);
    store.overrideSelector(selectAdminOrderSaving,       false);
    store.overrideSelector(selectAdminOrderError,        null);
    store.refreshState();

    fixture   = TestBed.createComponent(OrderDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => store?.resetSelectors());

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──────────────────────────────────────────────────

  describe('ngOnInit()', () => {
    it('dispatches adminOrderLoad with numeric id', async () => {
      await setup('42');
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(adminOrderLoad({ id: 42 }));
    });

    it('does NOT dispatch when route id is null', async () => {
      await setup(null);
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does NOT dispatch when route id is not a valid number', async () => {
      await setup('abc');
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Señales derivadas ─────────────────────────────────────────

  describe('items()', () => {
    it('returns [] when order is null', async () => {
      await setup();
      expect(component.items()).toEqual([]);
    });

    it('returns order items when order is loaded', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, MOCK_ORDER);
      store.refreshState();
      fixture.detectChanges();
      expect(component.items().length).toBe(1);
      expect(component.items()[0].name).toBe('Producto A');
    });
  });

  describe('payments()', () => {
    it('returns [] when order is null', async () => {
      await setup();
      expect(component.payments()).toEqual([]);
    });

    it('returns order payments when order is loaded', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, MOCK_ORDER);
      store.refreshState();
      fixture.detectChanges();
      expect(component.payments().length).toBe(1);
      expect(component.payments()[0].provider).toBe('stripe');
    });
  });

  // ── canAdvance / canCancel / canReturn ─────────────────────────

  describe('canAdvance()', () => {
    it('returns false when order is null', async () => {
      await setup();
      expect(component.canAdvance()).toBeFalse();
    });

    it('returns true when status is PAID', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.PAID });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canAdvance()).toBeTrue();
    });

    it('returns false when status is CANCELLED', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.CANCELLED });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canAdvance()).toBeFalse();
    });

    it('returns false when status is RETURNED', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.RETURNED });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canAdvance()).toBeFalse();
    });
  });

  describe('canCancel()', () => {
    it('returns true when status is PAID', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.PAID });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canCancel()).toBeTrue();
    });

    it('returns true when status is PROCESSING', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.PROCESSING });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canCancel()).toBeTrue();
    });

    it('returns false when status is DELIVERED', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.DELIVERED });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canCancel()).toBeFalse();
    });

    it('returns false when order is null', async () => {
      await setup();
      expect(component.canCancel()).toBeFalse();
    });
  });

  describe('canReturn()', () => {
    it('returns true only when status is DELIVERED', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.DELIVERED });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canReturn()).toBeTrue();
    });

    it('returns false when status is PAID', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, { ...MOCK_ORDER, status: OrderStatus.PAID });
      store.refreshState();
      fixture.detectChanges();
      expect(component.canReturn()).toBeFalse();
    });

    it('returns false when order is null', async () => {
      await setup();
      expect(component.canReturn()).toBeFalse();
    });
  });

  // ── statusSeverity / statusLabel ──────────────────────────────

  describe('statusSeverity()', () => {
    beforeEach(async () => setup());

    it('returns success for PAID',       () => expect(component.statusSeverity(OrderStatus.PAID)).toBe('success'));
    it('returns success for DELIVERED',  () => expect(component.statusSeverity(OrderStatus.DELIVERED)).toBe('success'));
    it('returns info for PROCESSING',    () => expect(component.statusSeverity(OrderStatus.PROCESSING)).toBe('info'));
    it('returns info for SHIPPED',       () => expect(component.statusSeverity(OrderStatus.SHIPPED)).toBe('info'));
    it('returns danger for CANCELLED',   () => expect(component.statusSeverity(OrderStatus.CANCELLED)).toBe('danger'));
    it('returns warn for RETURNED',      () => expect(component.statusSeverity(OrderStatus.RETURNED)).toBe('warn'));
    it('returns secondary for CREATED',  () => expect(component.statusSeverity(OrderStatus.CREATED)).toBe('secondary'));
  });

  describe('statusLabel()', () => {
    beforeEach(async () => setup());

    it('returns label for PAID',       () => expect(component.statusLabel(OrderStatus.PAID)).toBe('Pagado'));
    it('returns label for CANCELLED',  () => expect(component.statusLabel(OrderStatus.CANCELLED)).toBe('Cancelado'));
    it('returns label for PROCESSING', () => expect(component.statusLabel(OrderStatus.PROCESSING)).toBe('En proceso'));
    it('returns label for CREATED',    () => expect(component.statusLabel(OrderStatus.CREATED)).toBe('Creado'));
    it('returns label for DELIVERED',  () => expect(component.statusLabel(OrderStatus.DELIVERED)).toBe('Entregado'));
    it('returns label for SHIPPED',    () => expect(component.statusLabel(OrderStatus.SHIPPED)).toBe('Enviado'));
    it('returns label for RETURNED',   () => expect(component.statusLabel(OrderStatus.RETURNED)).toBe('Devuelto'));
  });

  // ── paymentSeverity / paymentLabel ────────────────────────────

  describe('paymentSeverity()', () => {
    beforeEach(async () => setup());

    it('returns success for SUCCESS',    () => expect(component.paymentSeverity(PaymentStatus.SUCCESS)).toBe('success'));
    it('returns info for AUTHORIZED',    () => expect(component.paymentSeverity(PaymentStatus.AUTHORIZED)).toBe('info'));
    it('returns warn for PENDING',       () => expect(component.paymentSeverity(PaymentStatus.PENDING)).toBe('warn'));
    it('returns danger for FAILED',      () => expect(component.paymentSeverity(PaymentStatus.FAILED)).toBe('danger'));
    it('returns danger for CANCELLED',   () => expect(component.paymentSeverity(PaymentStatus.CANCELLED)).toBe('danger'));
    it('returns danger for EXPIRED',     () => expect(component.paymentSeverity(PaymentStatus.EXPIRED)).toBe('danger'));
    it('returns secondary for REFUNDED', () => expect(component.paymentSeverity(PaymentStatus.REFUNDED)).toBe('secondary'));
  });

  describe('paymentLabel()', () => {
    beforeEach(async () => setup());

    it('returns label for SUCCESS',   () => expect(component.paymentLabel(PaymentStatus.SUCCESS)).toBe('Cobrado'));
    it('returns label for PENDING',   () => expect(component.paymentLabel(PaymentStatus.PENDING)).toBe('Pendiente'));
    it('returns label for REFUNDED',  () => expect(component.paymentLabel(PaymentStatus.REFUNDED)).toBe('Reembolsado'));
    it('returns label for CANCELLED', () => expect(component.paymentLabel(PaymentStatus.CANCELLED)).toBe('Cancelado'));
    it('returns label for FAILED',    () => expect(component.paymentLabel(PaymentStatus.FAILED)).toBe('Fallido'));
    it('returns label for CREATED',   () => expect(component.paymentLabel(PaymentStatus.CREATED)).toBe('Creado'));
  });

  // ── isCancellablePayment / isRefundablePayment ────────────────

  describe('isCancellablePayment()', () => {
    beforeEach(async () => setup());

    it('returns true for CREATED',    () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.CREATED })).toBeTrue());
    it('returns true for PENDING',    () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.PENDING })).toBeTrue());
    it('returns true for AUTHORIZED', () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.AUTHORIZED })).toBeTrue());
    it('returns false for SUCCESS',   () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.SUCCESS })).toBeFalse());
    it('returns false for REFUNDED',  () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.REFUNDED })).toBeFalse());
    it('returns false for FAILED',    () => expect(component.isCancellablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.FAILED })).toBeFalse());
  });

  describe('isRefundablePayment()', () => {
    beforeEach(async () => setup());

    it('returns true for SUCCESS',   () => expect(component.isRefundablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.SUCCESS })).toBeTrue());
    it('returns false for PENDING',  () => expect(component.isRefundablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.PENDING })).toBeFalse());
    it('returns false for REFUNDED', () => expect(component.isRefundablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.REFUNDED })).toBeFalse());
    it('returns false for FAILED',   () => expect(component.isRefundablePayment({ ...MOCK_PAYMENT, status: PaymentStatus.FAILED })).toBeFalse());
  });

  // ── Diálogo de avance de estado ───────────────────────────────

  describe('openNextStatusDialog()', () => {
    it('resets flags and makes dialog visible', async () => {
      await setup();
      component.nextStatusCancelled.set(true);
      component.nextStatusReturned.set(true);
      component.openNextStatusDialog();
      expect(component.nextStatusCancelled()).toBeFalse();
      expect(component.nextStatusReturned()).toBeFalse();
      expect(component.nextStatusDialogVisible()).toBeTrue();
    });
  });

  describe('confirmNextStatus()', () => {
    it('dispatches adminOrderNextStatus and closes dialog', async () => {
      await setup();
      store.overrideSelector(selectAdminOrderSelected, MOCK_ORDER);
      store.refreshState();
      fixture.detectChanges();
      const spy = spyOn(store, 'dispatch');
      component.nextStatusCancelled.set(false);
      component.nextStatusReturned.set(false);
      component.confirmNextStatus();
      expect(spy).toHaveBeenCalledWith(
        adminOrderNextStatus({ orderId: 1, cancelled: false, returned: false })
      );
      expect(component.nextStatusDialogVisible()).toBeFalse();
    });

    it('does nothing when order is null', async () => {
      await setup();
      const spy = spyOn(store, 'dispatch');
      component.confirmNextStatus();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Diálogos de pagos ─────────────────────────────────────────

  describe('onPaymentAction()', () => {
    beforeEach(async () => setup());

    it('opens cancel dialog for "Cancelar pago"', () => {
      component.onPaymentAction({
        action: { label: 'Cancelar pago', icon: 'cancel', severity: 'danger' },
        row: MOCK_PAYMENT as unknown as Record<string, unknown>,
      });
      expect(component.cancelPaymentTarget()).toEqual(MOCK_PAYMENT);
      expect(component.cancelPaymentDialogVisible()).toBeTrue();
    });

    it('opens refund dialog for "Reembolsar"', () => {
      component.onPaymentAction({
        action: { label: 'Reembolsar', icon: 'currency_exchange', severity: 'warn' },
        row: MOCK_PAYMENT as unknown as Record<string, unknown>,
      });
      expect(component.refundPaymentTarget()).toEqual(MOCK_PAYMENT);
      expect(component.refundPaymentDialogVisible()).toBeTrue();
    });
  });

  describe('confirmCancelPayment()', () => {
    it('dispatches adminPaymentCancel, closes dialog and clears target', async () => {
      await setup();
      component.cancelPaymentTarget.set(MOCK_PAYMENT);
      component.cancelPaymentDialogVisible.set(true);
      const spy = spyOn(store, 'dispatch');
      component.confirmCancelPayment();
      expect(spy).toHaveBeenCalledWith(adminPaymentCancel({ paymentId: 10 }));
      expect(component.cancelPaymentDialogVisible()).toBeFalse();
      expect(component.cancelPaymentTarget()).toBeNull();
    });

    it('closes dialog even when target is null', async () => {
      await setup();
      component.cancelPaymentTarget.set(null);
      const spy = spyOn(store, 'dispatch');
      component.confirmCancelPayment();
      expect(spy).not.toHaveBeenCalled();
      expect(component.cancelPaymentDialogVisible()).toBeFalse();
    });
  });

  describe('confirmRefundPayment()', () => {
    it('dispatches adminPaymentRefund, closes dialog and clears target', async () => {
      await setup();
      component.refundPaymentTarget.set(MOCK_PAYMENT);
      component.refundPaymentDialogVisible.set(true);
      const spy = spyOn(store, 'dispatch');
      component.confirmRefundPayment();
      expect(spy).toHaveBeenCalledWith(adminPaymentRefund({ paymentId: 10 }));
      expect(component.refundPaymentDialogVisible()).toBeFalse();
      expect(component.refundPaymentTarget()).toBeNull();
    });

    it('closes dialog even when target is null', async () => {
      await setup();
      component.refundPaymentTarget.set(null);
      const spy = spyOn(store, 'dispatch');
      component.confirmRefundPayment();
      expect(spy).not.toHaveBeenCalled();
      expect(component.refundPaymentDialogVisible()).toBeFalse();
    });
  });

  // ── Navegación ────────────────────────────────────────────────

  describe('goBack()', () => {
    it('navigates to /admin/orders', async () => {
      await setup();
      const router = TestBed.inject(Router);
      const spy = spyOn(router, 'navigate');
      component.goBack();
      expect(spy).toHaveBeenCalledWith(['/admin/orders']);
    });
  });
});
