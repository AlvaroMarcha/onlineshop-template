import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminOrdersService } from './admin-orders.service';
import { environment } from '../../../environments/environment';
import {
  OrderAdmin,
  OrderStatus,
  Page,
  PaymentAdmin,
  PaymentStatus,
} from '../../type/admin-types';

describe('AdminOrdersService', () => {
  let service: AdminOrdersService;
  let httpMock: HttpTestingController;

  const api = environment.urls.ordersUrl;

  const mockPayment: PaymentAdmin = {
    id: 10,
    orderId: 1,
    status: PaymentStatus.SUCCESS,
    amount: 99.99,
    provider: 'stripe',
    transactionId: 'pi_abc',
    createdAt: '2024-01-01T10:00:00',
  };

  const mockOrder: OrderAdmin = {
    id: 1,
    userId: 5,
    status: OrderStatus.PAID,
    totalAmount: 99.99,
    discountAmount: 0,
    couponCode: null,
    paymentMethod: 'stripe',
    createdAt: '2024-01-01T10:00:00',
    payments: [mockPayment],
    address: {
      addressLine1: 'Calle Mayor 1',
      addressLine2: null,
      country: 'ES',
      city: 'Madrid',
      postalCode: '28001',
    },
    orderItems: [],
  };

  const mockPage: Page<OrderAdmin> = {
    content: [mockOrder],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 20,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service  = TestBed.inject(AdminOrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Pedidos ───────────────────────────────────────────────────────────────

  it('getOrdersForAdmin() should GET /orders/admin/all with page params', () => {
    service.getOrdersForAdmin({ page: 0, size: 20 }).subscribe(page => {
      expect(page).toEqual(mockPage);
    });
    const req = httpMock.expectOne(r =>
      r.url === `${api}/admin/all` &&
      r.params.get('page') === '0' &&
      r.params.get('size') === '20'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('getOrderById() should GET /orders/admin/{id}', () => {
    service.getOrderById(1).subscribe(order => expect(order).toEqual(mockOrder));
    const req = httpMock.expectOne(`${api}/admin/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('nextOrderStatus() should POST /orders/next-status with query params', () => {
    service.nextOrderStatus(1, false, false).subscribe(status => {
      expect(status).toBe(OrderStatus.PROCESSING);
    });
    const req = httpMock.expectOne(r =>
      r.url === `${api}/next-status` &&
      r.params.get('orderId') === '1' &&
      r.params.get('cancelled') === 'false' &&
      r.params.get('returned') === 'false'
    );
    expect(req.request.method).toBe('POST');
    req.flush(OrderStatus.PROCESSING);
  });

  // ── Pagos ─────────────────────────────────────────────────────────────────

  it('nextPaymentStatus() should POST /orders/payments/{id}/nextStatus with targetStatus', () => {
    service.nextPaymentStatus(10, PaymentStatus.AUTHORIZED).subscribe(status => {
      expect(status).toBe(PaymentStatus.AUTHORIZED);
    });
    const req = httpMock.expectOne(r =>
      r.url === `${api}/payments/10/nextStatus` &&
      r.params.get('targetStatus') === 'AUTHORIZED'
    );
    expect(req.request.method).toBe('POST');
    req.flush(PaymentStatus.AUTHORIZED);
  });

  it('cancelPayment() should POST /orders/payments/{id}/cancel', () => {
    const cancelled: PaymentAdmin = { ...mockPayment, status: PaymentStatus.CANCELLED };
    service.cancelPayment(10).subscribe(payment => expect(payment).toEqual(cancelled));
    const req = httpMock.expectOne(`${api}/payments/10/cancel`);
    expect(req.request.method).toBe('POST');
    req.flush(cancelled);
  });

  it('refundPayment() should POST /orders/payments/{id}/refund', () => {
    const refunded: PaymentAdmin = { ...mockPayment, status: PaymentStatus.REFUNDED };
    service.refundPayment(10).subscribe(payment => expect(payment).toEqual(refunded));
    const req = httpMock.expectOne(`${api}/payments/10/refund`);
    expect(req.request.method).toBe('POST');
    req.flush(refunded);
  });
});
