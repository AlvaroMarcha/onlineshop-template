import { createReducer, on } from '@ngrx/store';
import { initialDashboardState } from './dashboard.state';
import * as A from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,

  // ── Inicio de carga ────────────────────────────────────────────
  on(A.dashboardLoadRevenue,
     A.dashboardLoadRevenueChart,
     A.dashboardLoadConversionRate,
     A.dashboardLoadAverageOrderValue,
     A.dashboardLoadOrderStats,
     A.dashboardLoadUserStats,
     A.dashboardLoadTopSelling,
     A.dashboardLoadLowStock,
     A.dashboardLoadPendingOrders,
     A.dashboardLoadRecentInvoices,
     A.dashboardLoadTodaySummary,
     A.dashboardLoadOrderQueue,
     A.dashboardLoadPendingRefunds,
     A.dashboardLoadDelayedShipments,
     A.dashboardLoadProductSummary,
     A.dashboardLoadMostViewed,
     A.dashboardLoadBestRated,
     A.dashboardLoadRecentReviews,
     A.dashboardLoadNewCustomers,
     A.dashboardLoadTopBuyers,
     A.dashboardLoadBannedCustomers,
     A.dashboardLoadCustomerRetention,
     A.dashboardLoadOrdersWithIssues,
     (state) => ({ ...state, loading: true, error: null })
  ),

  // ── Éxitos ─────────────────────────────────────────────────────
  on(A.dashboardLoadRevenueSuccess,          (s, { data }) => ({ ...s, loading: false, revenue: data })),
  on(A.dashboardLoadRevenueChartSuccess,     (s, { data }) => ({ ...s, loading: false, revenueChart: data })),
  on(A.dashboardLoadConversionRateSuccess,   (s, { data }) => ({ ...s, loading: false, conversionRate: data })),
  on(A.dashboardLoadAverageOrderValueSuccess,(s, { data }) => ({ ...s, loading: false, averageOrderValue: data })),
  on(A.dashboardLoadOrderStatsSuccess,       (s, { data }) => ({ ...s, loading: false, orderStats: data })),
  on(A.dashboardLoadUserStatsSuccess,        (s, { data }) => ({ ...s, loading: false, userStats: data })),
  on(A.dashboardLoadTopSellingSuccess,       (s, { data }) => ({ ...s, loading: false, topSellingProducts: data })),
  on(A.dashboardLoadLowStockSuccess,         (s, { data }) => ({ ...s, loading: false, lowStockProducts: data })),
  on(A.dashboardLoadPendingOrdersSuccess,    (s, { data }) => ({ ...s, loading: false, pendingOrders: data })),
  on(A.dashboardLoadRecentInvoicesSuccess,   (s, { data }) => ({ ...s, loading: false, recentInvoices: data })),
  on(A.dashboardLoadTodaySummarySuccess,     (s, { data }) => ({ ...s, loading: false, todayOrdersSummary: data })),
  on(A.dashboardLoadOrderQueueSuccess,       (s, { data }) => ({ ...s, loading: false, orderQueue: data })),
  on(A.dashboardLoadPendingRefundsSuccess,   (s, { data }) => ({ ...s, loading: false, pendingRefunds: data })),
  on(A.dashboardLoadDelayedShipmentsSuccess, (s, { data }) => ({ ...s, loading: false, delayedShipments: data })),
  on(A.dashboardLoadProductSummarySuccess,   (s, { data }) => ({ ...s, loading: false, productSummary: data })),
  on(A.dashboardLoadMostViewedSuccess,       (s, { data }) => ({ ...s, loading: false, mostViewedProducts: data })),
  on(A.dashboardLoadBestRatedSuccess,        (s, { data }) => ({ ...s, loading: false, bestRatedProducts: data })),
  on(A.dashboardLoadRecentReviewsSuccess,    (s, { data }) => ({ ...s, loading: false, recentReviews: data })),
  on(A.dashboardLoadNewCustomersSuccess,     (s, { data }) => ({ ...s, loading: false, newCustomers: data })),
  on(A.dashboardLoadTopBuyersSuccess,        (s, { data }) => ({ ...s, loading: false, topBuyers: data })),
  on(A.dashboardLoadBannedCustomersSuccess,  (s, { data }) => ({ ...s, loading: false, bannedCustomers: data })),
  on(A.dashboardLoadCustomerRetentionSuccess,(s, { data }) => ({ ...s, loading: false, customerRetention: data })),
  on(A.dashboardLoadOrdersWithIssuesSuccess, (s, { data }) => ({ ...s, loading: false, ordersWithIssues: data })),

  // ── Error ───────────────────────────────────────────────────────
  on(A.dashboardLoadFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
