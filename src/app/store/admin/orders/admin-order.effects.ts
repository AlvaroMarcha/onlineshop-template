import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store }                         from '@ngrx/store';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminOrdersService }        from '../../../services/admin/admin-orders.service';
import { selectAdminOrderSelected }  from './admin-order.selectors';
import * as A from './admin-order.actions';

@Injectable()
export class AdminOrderEffects {
  private actions$ = inject(Actions);
  private svc      = inject(AdminOrdersService);
  private store    = inject(Store);

  // ── Búsqueda ────────────────────────────────────────────────────────────────

  searchOrders$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminOrdersSearch),
    switchMap(({ params }) => this.svc.getOrdersForAdmin(params).pipe(
      map(page => A.adminOrdersSearchSuccess({ page })),
      catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Detalle ──────────────────────────────────────────────────────────────────

  loadOrder$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminOrderLoad),
    switchMap(({ id }) => this.svc.getOrderById(id).pipe(
      map(order => A.adminOrderLoadSuccess({ order })),
      catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Avanzar estado de pedido ─────────────────────────────────────────────────

  nextOrderStatus$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminOrderNextStatus),
    switchMap(({ orderId, cancelled, returned }) =>
      this.svc.nextOrderStatus(orderId, cancelled, returned).pipe(
        map(status => A.adminOrderNextStatusSuccess({ orderId, status })),
        catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
      )
    )
  ));

  // ── Avanzar estado de pago ────────────────────────────────────────────────────

  nextPaymentStatus$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminPaymentNextStatus),
    switchMap(({ paymentId, targetStatus }) =>
      this.svc.nextPaymentStatus(paymentId, targetStatus).pipe(
        map(status => A.adminPaymentNextStatusSuccess({ paymentId, status })),
        catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
      )
    )
  ));

  // ── Cancelar pago ─────────────────────────────────────────────────────────────

  cancelPayment$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminPaymentCancel),
    switchMap(({ paymentId }) => this.svc.cancelPayment(paymentId).pipe(
      map(payment => A.adminPaymentCancelSuccess({ payment })),
      catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Reembolsar pago ───────────────────────────────────────────────────────────

  refundPayment$ = createEffect(() => this.actions$.pipe(
    ofType(A.adminPaymentRefund),
    switchMap(({ paymentId }) => this.svc.refundPayment(paymentId).pipe(
      map(payment => A.adminPaymentRefundSuccess({ payment })),
      catchError(err => of(A.adminOrderFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── Recargar pedido tras mutación de pago ────────────────────────────────────
  // El backend recalcula el estado del pedido automáticamente al cambiar pagos,
  // por lo que recargamos el pedido seleccionado para mantener la vista actualizada.

  reloadAfterPaymentChange$ = createEffect(() => this.actions$.pipe(
    ofType(
      A.adminPaymentNextStatusSuccess,
      A.adminPaymentCancelSuccess,
      A.adminPaymentRefundSuccess
    ),
    withLatestFrom(this.store.select(selectAdminOrderSelected)),
    filter(([, selected]) => selected !== null),
    map(([, selected]) => A.adminOrderLoad({ id: selected!.id }))
  ));
}
