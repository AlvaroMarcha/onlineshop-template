import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import {
  MCard, MButton, MTable, MIcon, MSelect, MInput, MChip,
} from '../../../components/marcha';
import type { MTableColumn, MTableAction, MChipSeverity, MSelectOption } from '../../../components/marcha';
import {
  adminOrdersSearch,
  adminOrdersSetPage,
} from '../../../store/admin/orders/admin-order.actions';
import {
  selectAdminOrders,
  selectAdminOrderLoading,
  selectAdminOrderError,
} from '../../../store/admin/orders/admin-order.selectors';
import { OrderAdmin, OrderSearchParams, OrderStatus } from '../../../type/admin-types';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, FormsModule,
    MCard, MButton, MTable, MIcon, MSelect, MInput, MChip,
  ],
  templateUrl: './orders.html',
  styleUrl:    './orders.css',
})
export class OrdersAdmin implements OnInit {
  private store  = inject(Store);
  private router = inject(Router);

  // ── Store selectors ──────────────────────────────────────────
  readonly ordersPage = toSignal(this.store.select(selectAdminOrders),       { initialValue: null });
  readonly loading    = toSignal(this.store.select(selectAdminOrderLoading), { initialValue: false });
  readonly error      = toSignal(this.store.select(selectAdminOrderError));

  // ── Paginación ────────────────────────────────────────────────
  readonly pageIndex  = signal(0);
  readonly pageSize   = signal(20);
  readonly total      = computed(() => this.ordersPage()?.totalElements ?? 0);
  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
  readonly pageNums   = computed(() => {
    const n = this.totalPages();
    return Array.from({ length: n }, (_, i) => i + 1);
  });

  // ── Filtros locales ───────────────────────────────────────────
  readonly searchIdTerm  = signal('');
  readonly statusFilter  = signal<string>('all');

  readonly allOrders = computed(() => this.ordersPage()?.content ?? []);

  readonly orders = computed(() => {
    const list   = this.allOrders();
    const id     = this.searchIdTerm().trim();
    const status = this.statusFilter();
    return list.filter(o => {
      const matchId     = !id || String(o.id).includes(id);
      const matchStatus = status === 'all' || o.status === status;
      return matchId && matchStatus;
    });
  });

  // ── Opciones de filtro ────────────────────────────────────────
  readonly statusOptions: MSelectOption[] = [
    { label: 'Todos',       value: 'all'                   },
    { label: 'Creado',      value: OrderStatus.CREATED    },
    { label: 'Pagado',      value: OrderStatus.PAID       },
    { label: 'En proceso',  value: OrderStatus.PROCESSING },
    { label: 'Enviado',     value: OrderStatus.SHIPPED    },
    { label: 'Entregado',   value: OrderStatus.DELIVERED  },
    { label: 'Cancelado',   value: OrderStatus.CANCELLED  },
    { label: 'Devuelto',    value: OrderStatus.RETURNED   },
  ];

  // ── Columnas de la tabla ──────────────────────────────────────
  readonly columns: MTableColumn[] = [
    {
      field: 'id',
      header: 'Pedido',
      format: (v) => `#${v}`,
    },
    {
      field: 'userId',
      header: 'Cliente',
      format: (v) => `Usuario #${v}`,
    },
    {
      field: 'createdAt',
      header: 'Fecha',
      format: (v) => new Date(String(v)).toLocaleDateString('es-ES'),
    },
    {
      field: 'totalAmount',
      header: 'Total',
      align: 'right',
      format: (v) => `${Number(v).toFixed(2)} €`,
    },
    {
      field: 'orderItems',
      header: 'Artículos',
      align: 'center',
      format: (v) => String((v as unknown[])?.length ?? 0),
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      align: 'center',
      badgeSeverity: (v) => this.statusSeverity(v as OrderStatus),
      badgeLabel:    (v) => this.statusLabel(v as OrderStatus),
    },
    {
      field: 'paymentMethod',
      header: 'Método',
    },
  ];

  readonly actions: MTableAction[] = [
    { label: 'Ver', icon: 'visibility', severity: 'info' },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit() {
    this.loadOrders();
  }

  // ── Carga de pedidos ──────────────────────────────────────────
  loadOrders() {
    const params: OrderSearchParams = {
      page: this.pageIndex(),
      size: this.pageSize(),
    };
    this.store.dispatch(adminOrdersSearch({ params }));
    this.store.dispatch(adminOrdersSetPage({ page: params.page, size: params.size }));
  }

  // ── Acciones de tabla ─────────────────────────────────────────
  onAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const order = event.row as unknown as OrderAdmin;
    if (event.action.label === 'Ver') {
      this.router.navigate(['/admin/orders', order.id]);
    }
  }

  // ── Paginación ────────────────────────────────────────────────
  goToPage(n: number) {
    this.pageIndex.set(n);
    this.loadOrders();
  }

  prevPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update(p => p - 1);
      this.loadOrders();
    }
  }

  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1) {
      this.pageIndex.update(p => p + 1);
      this.loadOrders();
    }
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
}


