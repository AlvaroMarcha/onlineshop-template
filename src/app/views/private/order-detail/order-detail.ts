import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  MCard, MButton, MTable, MIcon, MDialog, MSelect,
} from '../../../components/marcha';
import type { MTableColumn, MTableAction, MChipSeverity, MSelectOption } from '../../../components/marcha';
import {
  adminOrderLoad,
  adminOrderNextStatus,
  adminPaymentCancel,
  adminPaymentRefund,
} from '../../../store/admin/orders/admin-order.actions';
import {
  selectAdminOrderSelected,
  selectAdminOrderDetailLoading,
  selectAdminOrderSaving,
  selectAdminOrderError,
} from '../../../store/admin/orders/admin-order.selectors';
import { OrderAdmin, OrderItemAdmin, OrderStatus, PaymentAdmin, PaymentStatus } from '../../../type/admin-types';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    DatePipe, DecimalPipe,
    MCard, MButton, MTable, MIcon, MDialog, MSelect,
  ],
  templateUrl: './order-detail.html',
  styleUrl:    './order-detail.css',
})
export class OrderDetail implements OnInit, OnDestroy {
  private store   = inject(Store);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);
  private destroy$ = new Subject<void>();

  // ── Store ─────────────────────────────────────────────────────
  readonly order   = toSignal(this.store.select(selectAdminOrderSelected));
  readonly loading = toSignal(this.store.select(selectAdminOrderDetailLoading), { initialValue: false });
  readonly saving  = toSignal(this.store.select(selectAdminOrderSaving),        { initialValue: false });
  readonly error   = toSignal(this.store.select(selectAdminOrderError));

  // ── Datos derivados ───────────────────────────────────────────
  readonly items    = computed(() => this.order()?.orderItems ?? []);
  readonly payments = computed(() => this.order()?.payments   ?? []);

  // ── Diálogo de avance de estado ───────────────────────────────
  readonly nextStatusDialogVisible = signal(false);
  readonly nextStatusCancelled     = signal(false);
  readonly nextStatusReturned      = signal(false);

  // ── Diálogo de cancelar pago ──────────────────────────────────
  readonly cancelPaymentDialogVisible = signal(false);
  readonly cancelPaymentTarget        = signal<PaymentAdmin | null>(null);

  // ── Diálogo de reembolsar pago ────────────────────────────────
  readonly refundPaymentDialogVisible = signal(false);
  readonly refundPaymentTarget        = signal<PaymentAdmin | null>(null);

  // ── Opciones de estado siguiente ─────────────────────────────
  readonly cancellableStatuses = new Set<OrderStatus>([
    OrderStatus.CREATED, OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED,
  ]);

  readonly returnableStatuses = new Set<OrderStatus>([
    OrderStatus.DELIVERED,
  ]);

  readonly canAdvance = computed(() => {
    const s = this.order()?.status;
    if (!s) return false;
    const terminal = new Set<OrderStatus>([
      OrderStatus.CANCELLED, OrderStatus.RETURNED,
    ]);
    return !terminal.has(s);
  });

  readonly canCancel = computed(() =>
    !!this.order()?.status && this.cancellableStatuses.has(this.order()!.status)
  );

  readonly canReturn = computed(() =>
    !!this.order()?.status && this.returnableStatuses.has(this.order()!.status)
  );

  // ── Columnas items ────────────────────────────────────────────
  readonly itemsColumns: MTableColumn[] = [
    { field: 'name',     header: 'Producto',
      format: (_v, row) => `${row['name']} · ${row['sku'] ?? ''}` },
    { field: 'quantity', header: 'Cant.',   align: 'center' },
    {
      field: 'price', header: 'P. Unit.', align: 'right',
      format: (_v, row) => {
        const p = Number(row['discountPrice'] ?? row['price']);
        return `${p.toFixed(2)} €`;
      },
    },
    {
      field: 'quantity', header: 'Subtotal', align: 'right',
      format: (_v, row) => {
        const qty  = Number(row['quantity']);
        const p    = Number(row['discountPrice'] ?? row['price']);
        return `${(qty * p).toFixed(2)} €`;
      },
    },
    {
      field: 'isDigital', header: 'Digital', align: 'center', type: 'badge',
      badgeSeverity: (v) => (v ? 'info' : 'secondary') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Sí' : 'No'),
    },
  ];

  // ── Columnas pagos ────────────────────────────────────────────
  readonly paymentsColumns: MTableColumn[] = [
    { field: 'id',          header: '#',        format: (v) => `#${v}` },
    { field: 'provider',    header: 'Proveedor' },
    { field: 'amount',      header: 'Importe',  align: 'right',
      format: (v) => `${Number(v).toFixed(2)} €` },
    {
      field: 'status', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => this.paymentSeverity(v as PaymentStatus),
      badgeLabel:    (v) => this.paymentLabel(v as PaymentStatus),
    },
    {
      field: 'createdAt', header: 'Fecha',
      format: (v) => new Date(String(v)).toLocaleString('es-ES'),
    },
  ];

  readonly paymentsActions: MTableAction[] = [
    { label: 'Cancelar pago', icon: 'cancel',     severity: 'danger' },
    { label: 'Reembolsar',    icon: 'currency_exchange', severity: 'warn' },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.dispatch(adminOrderLoad({ id }));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Navegación ────────────────────────────────────────────────
  goBack() {
    this.router.navigate(['/admin/orders']);
  }

  // ── Acciones estado de pedido ─────────────────────────────────
  openNextStatusDialog() {
    this.nextStatusCancelled.set(false);
    this.nextStatusReturned.set(false);
    this.nextStatusDialogVisible.set(true);
  }

  confirmNextStatus() {
    const o = this.order();
    if (!o) return;
    this.store.dispatch(adminOrderNextStatus({
      orderId:   o.id,
      cancelled: this.nextStatusCancelled(),
      returned:  this.nextStatusReturned(),
    }));
    this.nextStatusDialogVisible.set(false);
  }

  // ── Acciones pago ─────────────────────────────────────────────
  onPaymentAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const payment = event.row as unknown as PaymentAdmin;
    if (event.action.label === 'Cancelar pago') {
      this.cancelPaymentTarget.set(payment);
      this.cancelPaymentDialogVisible.set(true);
    } else if (event.action.label === 'Reembolsar') {
      this.refundPaymentTarget.set(payment);
      this.refundPaymentDialogVisible.set(true);
    }
  }

  confirmCancelPayment() {
    const p = this.cancelPaymentTarget();
    if (p) {
      this.store.dispatch(adminPaymentCancel({ paymentId: p.id }));
    }
    this.cancelPaymentDialogVisible.set(false);
    this.cancelPaymentTarget.set(null);
  }

  confirmRefundPayment() {
    const p = this.refundPaymentTarget();
    if (p) {
      this.store.dispatch(adminPaymentRefund({ paymentId: p.id }));
    }
    this.refundPaymentDialogVisible.set(false);
    this.refundPaymentTarget.set(null);
  }

  // ── Utilidades de estado ──────────────────────────────────────
  statusSeverity(status: OrderStatus): MChipSeverity {
    switch (status) {
      case OrderStatus.PAID:
      case OrderStatus.DELIVERED:  return 'success';
      case OrderStatus.PROCESSING:
      case OrderStatus.SHIPPED:    return 'info';
      case OrderStatus.CANCELLED:  return 'danger';
      case OrderStatus.RETURNED:   return 'warn';
      default:                     return 'secondary';
    }
  }

  statusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      [OrderStatus.CREATED]:    'Creado',
      [OrderStatus.PAID]:       'Pagado',
      [OrderStatus.PROCESSING]: 'En proceso',
      [OrderStatus.SHIPPED]:    'Enviado',
      [OrderStatus.DELIVERED]:  'Entregado',
      [OrderStatus.CANCELLED]:  'Cancelado',
      [OrderStatus.RETURNED]:   'Devuelto',
    };
    return map[status] ?? status;
  }

  paymentSeverity(status: PaymentStatus): MChipSeverity {
    switch (status) {
      case PaymentStatus.SUCCESS:    return 'success';
      case PaymentStatus.AUTHORIZED: return 'info';
      case PaymentStatus.PENDING:    return 'warn';
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
      case PaymentStatus.EXPIRED:    return 'danger';
      case PaymentStatus.REFUNDED:   return 'secondary';
      default:                       return 'secondary';
    }
  }

  paymentLabel(status: PaymentStatus): string {
    const map: Record<PaymentStatus, string> = {
      [PaymentStatus.CREATED]:    'Creado',
      [PaymentStatus.PENDING]:    'Pendiente',
      [PaymentStatus.AUTHORIZED]: 'Autorizado',
      [PaymentStatus.SUCCESS]:    'Cobrado',
      [PaymentStatus.FAILED]:     'Fallido',
      [PaymentStatus.CANCELLED]:  'Cancelado',
      [PaymentStatus.EXPIRED]:    'Expirado',
      [PaymentStatus.REFUNDED]:   'Reembolsado',
    };
    return map[status] ?? status;
  }

  isCancellablePayment(payment: PaymentAdmin): boolean {
    const cancellable = new Set<PaymentStatus>([
      PaymentStatus.CREATED, PaymentStatus.PENDING, PaymentStatus.AUTHORIZED,
    ]);
    return cancellable.has(payment.status);
  }

  isRefundablePayment(payment: PaymentAdmin): boolean {
    return payment.status === PaymentStatus.SUCCESS;
  }
}

