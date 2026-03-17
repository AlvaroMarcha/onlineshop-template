import { createAction, props } from '@ngrx/store';
import {
  OrderAdmin,
  OrderSearchParams,
  OrderStatus,
  Page,
  PaymentAdmin,
  PaymentStatus,
} from '../../../type/admin-types';

// ── Búsqueda / listado ────────────────────────────────────────────────────────

export const adminOrdersSearch = createAction(
  '[AdminOrders] Search',
  props<{ params: OrderSearchParams }>()
);

export const adminOrdersSearchSuccess = createAction(
  '[AdminOrders] Search Success',
  props<{ page: Page<OrderAdmin> }>()
);

export const adminOrdersSetPage = createAction(
  '[AdminOrders] Set Page',
  props<{ page: number; size: number }>()
);

// ── Detalle de pedido ─────────────────────────────────────────────────────────

export const adminOrderLoad = createAction(
  '[AdminOrders] Load Order',
  props<{ id: number }>()
);

export const adminOrderLoadSuccess = createAction(
  '[AdminOrders] Load Order Success',
  props<{ order: OrderAdmin }>()
);

// ── Avanzar estado de pedido ──────────────────────────────────────────────────

export const adminOrderNextStatus = createAction(
  '[AdminOrders] Next Order Status',
  props<{ orderId: number; cancelled: boolean; returned: boolean }>()
);

export const adminOrderNextStatusSuccess = createAction(
  '[AdminOrders] Next Order Status Success',
  props<{ orderId: number; status: OrderStatus }>()
);

// ── Avanzar estado de pago ────────────────────────────────────────────────────

export const adminPaymentNextStatus = createAction(
  '[AdminOrders] Next Payment Status',
  props<{ paymentId: number; targetStatus: PaymentStatus }>()
);

export const adminPaymentNextStatusSuccess = createAction(
  '[AdminOrders] Next Payment Status Success',
  props<{ paymentId: number; status: PaymentStatus }>()
);

// ── Cancelar pago ─────────────────────────────────────────────────────────────

export const adminPaymentCancel = createAction(
  '[AdminOrders] Cancel Payment',
  props<{ paymentId: number }>()
);

export const adminPaymentCancelSuccess = createAction(
  '[AdminOrders] Cancel Payment Success',
  props<{ payment: PaymentAdmin }>()
);

// ── Reembolsar pago ───────────────────────────────────────────────────────────

export const adminPaymentRefund = createAction(
  '[AdminOrders] Refund Payment',
  props<{ paymentId: number }>()
);

export const adminPaymentRefundSuccess = createAction(
  '[AdminOrders] Refund Payment Success',
  props<{ payment: PaymentAdmin }>()
);

// ── Error global ──────────────────────────────────────────────────────────────

export const adminOrderFailure = createAction(
  '[AdminOrders] Failure',
  props<{ error: string }>()
);
