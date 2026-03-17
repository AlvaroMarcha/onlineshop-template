import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrderAdmin,
  OrderSearchParams,
  OrderStatus,
  Page,
  PaymentAdmin,
  PaymentStatus,
} from '../../type/admin-types';

@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
  private readonly api = environment.urls.ordersUrl;

  constructor(private http: HttpClient) {}

  // ── Pedidos ───────────────────────────────────────────────────

  getOrdersForAdmin(params: OrderSearchParams): Observable<Page<OrderAdmin>> {
    return this.http.get<Page<OrderAdmin>>(`${this.api}/admin/all`, {
      params: {
        page: params.page.toString(),
        size: params.size.toString(),
      },
    });
  }

  getOrderById(id: number): Observable<OrderAdmin> {
    return this.http.get<OrderAdmin>(`${this.api}/admin/${id}`);
  }

  nextOrderStatus(
    orderId: number,
    cancelled: boolean,
    returned: boolean
  ): Observable<OrderStatus> {
    return this.http.post<OrderStatus>(`${this.api}/next-status`, null, {
      params: {
        orderId: orderId.toString(),
        cancelled: cancelled.toString(),
        returned: returned.toString(),
      },
    });
  }

  // ── Pagos ─────────────────────────────────────────────────────

  nextPaymentStatus(
    paymentId: number,
    targetStatus: PaymentStatus
  ): Observable<PaymentStatus> {
    return this.http.post<PaymentStatus>(
      `${this.api}/payments/${paymentId}/nextStatus`,
      null,
      { params: { targetStatus } }
    );
  }

  cancelPayment(paymentId: number): Observable<PaymentAdmin> {
    return this.http.post<PaymentAdmin>(
      `${this.api}/payments/${paymentId}/cancel`,
      null
    );
  }

  refundPayment(paymentId: number): Observable<PaymentAdmin> {
    return this.http.post<PaymentAdmin>(
      `${this.api}/payments/${paymentId}/refund`,
      null
    );
  }
}
