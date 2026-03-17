import { createAction, props } from '@ngrx/store';
import {
  AverageOrderValueResponse,
  BannedCustomer,
  BestRatedProduct,
  ConversionRateResponse,
  CustomerRetention,
  DelayedShipment,
  LowStockProduct,
  MostViewedProduct,
  NewCustomer,
  OrderQueueItem,
  OrderStatsResponse,
  OrderWithIssue,
  PendingOrder,
  PendingRefund,
  ProductSummary,
  RecentInvoice,
  RecentReview,
  RevenueChartResponse,
  RevenueResponse,
  TodayOrdersSummary,
  TopBuyer,
  TopSellingProduct,
  UserStatsResponse,
} from '../../../type/admin-types';

// ── Carga por rol ─────────────────────────────────────────────────

// SUPER_ADMIN
export const dashboardLoadRevenue = createAction('[Dashboard] Load Revenue');
export const dashboardLoadRevenueSuccess = createAction('[Dashboard] Load Revenue Success', props<{ data: RevenueResponse }>());

export const dashboardLoadRevenueChart = createAction('[Dashboard] Load Revenue Chart');
export const dashboardLoadRevenueChartSuccess = createAction('[Dashboard] Load Revenue Chart Success', props<{ data: RevenueChartResponse }>());

export const dashboardLoadConversionRate = createAction('[Dashboard] Load Conversion Rate');
export const dashboardLoadConversionRateSuccess = createAction('[Dashboard] Load Conversion Rate Success', props<{ data: ConversionRateResponse }>());

export const dashboardLoadAverageOrderValue = createAction('[Dashboard] Load Average Order Value');
export const dashboardLoadAverageOrderValueSuccess = createAction('[Dashboard] Load Average Order Value Success', props<{ data: AverageOrderValueResponse }>());

// SUPER_ADMIN + ADMIN
export const dashboardLoadOrderStats = createAction('[Dashboard] Load Order Stats');
export const dashboardLoadOrderStatsSuccess = createAction('[Dashboard] Load Order Stats Success', props<{ data: OrderStatsResponse }>());

export const dashboardLoadUserStats = createAction('[Dashboard] Load User Stats');
export const dashboardLoadUserStatsSuccess = createAction('[Dashboard] Load User Stats Success', props<{ data: UserStatsResponse }>());

export const dashboardLoadTopSelling = createAction('[Dashboard] Load Top Selling');
export const dashboardLoadTopSellingSuccess = createAction('[Dashboard] Load Top Selling Success', props<{ data: TopSellingProduct[] }>());

export const dashboardLoadLowStock = createAction('[Dashboard] Load Low Stock');
export const dashboardLoadLowStockSuccess = createAction('[Dashboard] Load Low Stock Success', props<{ data: LowStockProduct[] }>());

export const dashboardLoadPendingOrders = createAction('[Dashboard] Load Pending Orders');
export const dashboardLoadPendingOrdersSuccess = createAction('[Dashboard] Load Pending Orders Success', props<{ data: PendingOrder[] }>());

export const dashboardLoadRecentInvoices = createAction('[Dashboard] Load Recent Invoices');
export const dashboardLoadRecentInvoicesSuccess = createAction('[Dashboard] Load Recent Invoices Success', props<{ data: RecentInvoice[] }>());

// ORDERS role
export const dashboardLoadTodaySummary = createAction('[Dashboard] Load Today Summary');
export const dashboardLoadTodaySummarySuccess = createAction('[Dashboard] Load Today Summary Success', props<{ data: TodayOrdersSummary }>());

export const dashboardLoadOrderQueue = createAction('[Dashboard] Load Order Queue');
export const dashboardLoadOrderQueueSuccess = createAction('[Dashboard] Load Order Queue Success', props<{ data: OrderQueueItem[] }>());

export const dashboardLoadPendingRefunds = createAction('[Dashboard] Load Pending Refunds');
export const dashboardLoadPendingRefundsSuccess = createAction('[Dashboard] Load Pending Refunds Success', props<{ data: PendingRefund[] }>());

export const dashboardLoadDelayedShipments = createAction('[Dashboard] Load Delayed Shipments');
export const dashboardLoadDelayedShipmentsSuccess = createAction('[Dashboard] Load Delayed Shipments Success', props<{ data: DelayedShipment[] }>());

// STORE role
export const dashboardLoadProductSummary = createAction('[Dashboard] Load Product Summary');
export const dashboardLoadProductSummarySuccess = createAction('[Dashboard] Load Product Summary Success', props<{ data: ProductSummary }>());

export const dashboardLoadMostViewed = createAction('[Dashboard] Load Most Viewed');
export const dashboardLoadMostViewedSuccess = createAction('[Dashboard] Load Most Viewed Success', props<{ data: MostViewedProduct[] }>());

export const dashboardLoadBestRated = createAction('[Dashboard] Load Best Rated');
export const dashboardLoadBestRatedSuccess = createAction('[Dashboard] Load Best Rated Success', props<{ data: BestRatedProduct[] }>());

export const dashboardLoadRecentReviews = createAction('[Dashboard] Load Recent Reviews');
export const dashboardLoadRecentReviewsSuccess = createAction('[Dashboard] Load Recent Reviews Success', props<{ data: RecentReview[] }>());

// CUSTOMERS_INVOICES role
export const dashboardLoadNewCustomers = createAction('[Dashboard] Load New Customers');
export const dashboardLoadNewCustomersSuccess = createAction('[Dashboard] Load New Customers Success', props<{ data: NewCustomer[] }>());

export const dashboardLoadTopBuyers = createAction('[Dashboard] Load Top Buyers');
export const dashboardLoadTopBuyersSuccess = createAction('[Dashboard] Load Top Buyers Success', props<{ data: TopBuyer[] }>());

export const dashboardLoadBannedCustomers = createAction('[Dashboard] Load Banned Customers');
export const dashboardLoadBannedCustomersSuccess = createAction('[Dashboard] Load Banned Customers Success', props<{ data: BannedCustomer[] }>());

export const dashboardLoadCustomerRetention = createAction('[Dashboard] Load Customer Retention');
export const dashboardLoadCustomerRetentionSuccess = createAction('[Dashboard] Load Customer Retention Success', props<{ data: CustomerRetention }>());

// SUPPORT role
export const dashboardLoadOrdersWithIssues = createAction('[Dashboard] Load Orders With Issues');
export const dashboardLoadOrdersWithIssuesSuccess = createAction('[Dashboard] Load Orders With Issues Success', props<{ data: OrderWithIssue[] }>());

// Error genérico
export const dashboardLoadFailure = createAction('[Dashboard] Load Failure', props<{ error: string }>());
