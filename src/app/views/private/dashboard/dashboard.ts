import { Component, OnInit, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MCard, MChip, MTable, MIcon } from '../../../components/marcha';
import type { MTableColumn, MChipSeverity } from '../../../components/marcha';
import { selectUser } from '../../../store/auth/auth.selectors';
import {
  selectOrderStats,
  selectUserStats,
  selectLowStockProducts,
  selectPendingOrders,
  selectRecentInvoices,
  selectRevenue,
  selectConversionRate,
  selectAverageOrderValue,
  selectTodayOrdersSummary,
  selectOrderQueue,
  selectPendingRefunds,
  selectProductSummary,
  selectMostViewedProducts,
  selectNewCustomers,
  selectTopBuyers,
  selectOrdersWithIssues,
  selectDashboardLoading,
} from '../../../store/admin/dashboard/dashboard.selectors';
import * as A from '../../../store/admin/dashboard/dashboard.actions';
import { OrderStatus } from '../../../type/admin-types';
import { CurrencyPipe, DatePipe } from '@angular/common';

const ADMIN_ROLES    = ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];
const SUPER_ADMIN    = 'ROLE_SUPER_ADMIN';
const ORDERS_ROLE    = 'ROLE_ORDERS';
const STORE_ROLE     = 'ROLE_STORE';
const CUSTOMERS_ROLE = 'ROLE_CUSTOMERS_INVOICES';
const SUPPORT_ROLE   = 'ROLE_SUPPORT';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, MCard, MChip, MTable, MIcon, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private store = inject(Store);

  readonly user             = toSignal(this.store.select(selectUser));
  readonly loading          = toSignal(this.store.select(selectDashboardLoading), { initialValue: false });

  // SUPER_ADMIN + ADMIN
  readonly orderStats       = toSignal(this.store.select(selectOrderStats));
  readonly userStats        = toSignal(this.store.select(selectUserStats));
  readonly lowStockProducts = toSignal(this.store.select(selectLowStockProducts), { initialValue: [] });
  readonly pendingOrders    = toSignal(this.store.select(selectPendingOrders),    { initialValue: [] });
  readonly recentInvoices   = toSignal(this.store.select(selectRecentInvoices),   { initialValue: [] });

  // SUPER_ADMIN
  readonly revenue          = toSignal(this.store.select(selectRevenue));
  readonly conversionRate   = toSignal(this.store.select(selectConversionRate));
  readonly avgOrderValue    = toSignal(this.store.select(selectAverageOrderValue));

  // ORDERS
  readonly todaySummary     = toSignal(this.store.select(selectTodayOrdersSummary));
  readonly orderQueue       = toSignal(this.store.select(selectOrderQueue),        { initialValue: [] });
  readonly pendingRefunds   = toSignal(this.store.select(selectPendingRefunds),    { initialValue: [] });

  // STORE
  readonly productSummary   = toSignal(this.store.select(selectProductSummary));
  readonly mostViewed       = toSignal(this.store.select(selectMostViewedProducts), { initialValue: [] });

  // CUSTOMERS
  readonly newCustomers     = toSignal(this.store.select(selectNewCustomers),   { initialValue: [] });
  readonly topBuyers        = toSignal(this.store.select(selectTopBuyers),      { initialValue: [] });

  // SUPPORT
  readonly ordersWithIssues = toSignal(this.store.select(selectOrdersWithIssues), { initialValue: [] });

  // ── Role flags (computed) ────────────────────────────────────
  readonly isAdmin       = computed(() => ADMIN_ROLES.includes(this.user()?.roleName ?? ''));
  readonly isSuperAdmin  = computed(() => this.user()?.roleName === SUPER_ADMIN);
  readonly isOrders      = computed(() => this.user()?.roleName === ORDERS_ROLE);
  readonly isStore       = computed(() => this.user()?.roleName === STORE_ROLE);
  readonly isCustomers   = computed(() => this.user()?.roleName === CUSTOMERS_ROLE);
  readonly isSupport     = computed(() => this.user()?.roleName === SUPPORT_ROLE);

  // ── Table columns ────────────────────────────────────────────
  readonly lowStockCols: MTableColumn[] = [
    { field: 'productName', header: 'Producto' },
    { field: 'currentStock', header: 'Stock', type: 'number', align: 'center' },
    { field: 'soldCount',    header: 'Vendidos', type: 'number', align: 'center' },
    {
      field: 'isActive', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'success' : 'danger') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Activo' : 'Inactivo'),
    },
  ];

  readonly pendingOrdersCols: MTableColumn[] = [
    { field: 'orderId',       header: '#', type: 'number', width: '60px' },
    { field: 'userName',      header: 'Cliente' },
    { field: 'totalAmount',   header: 'Total',  type: 'number', align: 'right',
      format: (v) => `${Number(v).toFixed(2)} €` },
    { field: 'itemCount',     header: 'Items',  type: 'number', align: 'center', width: '70px' },
    {
      field: 'status', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => this.orderStatusSeverity(v as OrderStatus),
      badgeLabel:    (v) => v as string,
    },
  ];

  readonly orderQueueCols: MTableColumn[] = [
    { field: 'orderId',              header: '#',     type: 'number', width: '60px' },
    { field: 'customerName',         header: 'Cliente' },
    { field: 'totalAmount',          header: 'Total', type: 'number', align: 'right',
      format: (v) => `${Number(v).toFixed(2)} €` },
    { field: 'hoursSinceCreation',   header: 'Horas', type: 'number', align: 'center', width: '70px' },
    {
      field: 'status', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => this.orderStatusSeverity(v as OrderStatus),
      badgeLabel:    (v) => v as string,
    },
  ];

  readonly topBuyersCols: MTableColumn[] = [
    { field: 'name',              header: 'Nombre',
      format: (_, r) => `${r['name']} ${r['surname']}` },
    { field: 'email',             header: 'Email' },
    { field: 'orderCount',        header: 'Pedidos', type: 'number', align: 'center' },
    { field: 'totalSpent',        header: 'Total gastado', type: 'number', align: 'right',
      format: (v) => `${Number(v).toFixed(2)} €` },
  ];

  readonly issuesCols: MTableColumn[] = [
    { field: 'orderId',        header: '#', type: 'number', width: '60px' },
    { field: 'customerName',   header: 'Cliente' },
    { field: 'customerEmail',  header: 'Email' },
    {
      field: 'hasFailedPayments', header: 'Pago fallido', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'danger' : 'success') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Sí' : 'No'),
    },
    {
      field: 'hasRefundedPayments', header: 'Reembolso', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'warn' : 'success') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Sí' : 'No'),
    },
  ];

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    const role = this.user()?.roleName ?? '';

    if (role === SUPER_ADMIN) {
      this.store.dispatch(A.dashboardLoadRevenue());
      this.store.dispatch(A.dashboardLoadConversionRate());
      this.store.dispatch(A.dashboardLoadAverageOrderValue());
    }

    if (ADMIN_ROLES.includes(role)) {
      this.store.dispatch(A.dashboardLoadOrderStats());
      this.store.dispatch(A.dashboardLoadUserStats());
      this.store.dispatch(A.dashboardLoadTopSelling());
      this.store.dispatch(A.dashboardLoadLowStock());
      this.store.dispatch(A.dashboardLoadPendingOrders());
      this.store.dispatch(A.dashboardLoadRecentInvoices());
    }

    if (role === ORDERS_ROLE) {
      this.store.dispatch(A.dashboardLoadTodaySummary());
      this.store.dispatch(A.dashboardLoadOrderQueue());
      this.store.dispatch(A.dashboardLoadPendingRefunds());
    }

    if (role === STORE_ROLE) {
      this.store.dispatch(A.dashboardLoadProductSummary());
      this.store.dispatch(A.dashboardLoadMostViewed());
      this.store.dispatch(A.dashboardLoadBestRated());
    }

    if (role === CUSTOMERS_ROLE) {
      this.store.dispatch(A.dashboardLoadNewCustomers());
      this.store.dispatch(A.dashboardLoadTopBuyers());
    }

    if (role === SUPPORT_ROLE) {
      this.store.dispatch(A.dashboardLoadOrdersWithIssues());
    }
  }

  orderStatusSeverity(status: OrderStatus): MChipSeverity {
    const map: Record<OrderStatus, MChipSeverity> = {
      [OrderStatus.CREATED]:    'info',
      [OrderStatus.PAID]:       'success',
      [OrderStatus.PROCESSING]: 'primary',
      [OrderStatus.SHIPPED]:    'primary',
      [OrderStatus.DELIVERED]:  'success',
      [OrderStatus.CANCELLED]:  'danger',
      [OrderStatus.RETURNED]:   'warn',
    };
    return map[status] ?? 'secondary';
  }
}

