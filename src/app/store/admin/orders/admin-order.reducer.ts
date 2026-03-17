import { createReducer, on } from '@ngrx/store';
import { AdminOrderState, initialAdminOrderState } from './admin-order.state';
import * as A from './admin-order.actions';

export const adminOrderReducer = createReducer<AdminOrderState>(
  initialAdminOrderState,

  // ── Búsqueda / listado ──────────────────────────────────────────────────────

  on(A.adminOrdersSearch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(A.adminOrdersSearchSuccess, (state, { page }) => ({
    ...state,
    orders:  page,
    loading: false,
  })),

  on(A.adminOrdersSetPage, (state, { page, size }) => ({
    ...state,
    searchParams: { ...state.searchParams, page, size },
  })),

  // ── Detalle de pedido ───────────────────────────────────────────────────────

  on(A.adminOrderLoad, (state) => ({
    ...state,
    detailLoading: true,
    error:         null,
  })),

  on(A.adminOrderLoadSuccess, (state, { order }) => ({
    ...state,
    selected:      order,
    detailLoading: false,
  })),

  // ── Avanzar estado de pedido ────────────────────────────────────────────────

  on(A.adminOrderNextStatus, (state) => ({
    ...state,
    saving: true,
    error:  null,
  })),

  on(A.adminOrderNextStatusSuccess, (state, { orderId, status }) => ({
    ...state,
    saving:   false,
    selected: state.selected?.id === orderId
      ? { ...state.selected, status }
      : state.selected,
    orders: state.orders
      ? {
          ...state.orders,
          content: state.orders.content.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }
      : null,
  })),

  // ── Avanzar / cancelar / reembolsar pago ────────────────────────────────────

  on(
    A.adminPaymentNextStatus,
    A.adminPaymentCancel,
    A.adminPaymentRefund,
    (state) => ({ ...state, saving: true, error: null })
  ),

  on(A.adminPaymentNextStatusSuccess, (state, { paymentId, status }) => ({
    ...state,
    saving:   false,
    selected: state.selected
      ? {
          ...state.selected,
          payments: state.selected.payments.map((p) =>
            p.id === paymentId ? { ...p, status } : p
          ),
        }
      : null,
  })),

  on(A.adminPaymentCancelSuccess, A.adminPaymentRefundSuccess, (state, { payment }) => ({
    ...state,
    saving:   false,
    selected: state.selected
      ? {
          ...state.selected,
          payments: state.selected.payments.map((p) =>
            p.id === payment.id ? payment : p
          ),
        }
      : null,
  })),

  // ── Error ───────────────────────────────────────────────────────────────────

  on(A.adminOrderFailure, (state, { error }) => ({
    ...state,
    loading:       false,
    detailLoading: false,
    saving:        false,
    error,
  }))
);
