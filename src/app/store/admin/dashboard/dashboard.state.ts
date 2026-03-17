import {
  RevenueResponse,
  RevenueChartResponse,
  ConversionRateResponse,
  AverageOrderValueResponse,
  OrderStatsResponse,
  UserStatsResponse,
  TopSellingProduct,
  LowStockProduct,
  PendingOrder,
  RecentInvoice,
  TodayOrdersSummary,
  OrderQueueItem,
  PendingRefund,
  DelayedShipment,
  ProductSummary,
  MostViewedProduct,
  BestRatedProduct,
  RecentReview,
  NewCustomer,
  TopBuyer,
  BannedCustomer,
  CustomerRetention,
  OrderWithIssue,
} from '../../../type/admin-types';

export interface DashboardState {
  // SUPER_ADMIN
  revenue: RevenueResponse | null;
  revenueChart: RevenueChartResponse | null;
  conversionRate: ConversionRateResponse | null;
  averageOrderValue: AverageOrderValueResponse | null;
  // SUPER_ADMIN + ADMIN
  orderStats: OrderStatsResponse | null;
  userStats: UserStatsResponse | null;
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
  pendingOrders: PendingOrder[];
  recentInvoices: RecentInvoice[];
  // ORDERS
  todayOrdersSummary: TodayOrdersSummary | null;
  orderQueue: OrderQueueItem[];
  pendingRefunds: PendingRefund[];
  delayedShipments: DelayedShipment[];
  // STORE
  productSummary: ProductSummary | null;
  mostViewedProducts: MostViewedProduct[];
  bestRatedProducts: BestRatedProduct[];
  recentReviews: RecentReview[];
  // CUSTOMERS_INVOICES
  newCustomers: NewCustomer[];
  topBuyers: TopBuyer[];
  bannedCustomers: BannedCustomer[];
  customerRetention: CustomerRetention | null;
  // SUPPORT
  ordersWithIssues: OrderWithIssue[];
  // meta
  loading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  revenue: null,
  revenueChart: null,
  conversionRate: null,
  averageOrderValue: null,
  orderStats: null,
  userStats: null,
  topSellingProducts: [],
  lowStockProducts: [],
  pendingOrders: [],
  recentInvoices: [],
  todayOrdersSummary: null,
  orderQueue: [],
  pendingRefunds: [],
  delayedShipments: [],
  productSummary: null,
  mostViewedProducts: [],
  bestRatedProducts: [],
  recentReviews: [],
  newCustomers: [],
  topBuyers: [],
  bannedCustomers: [],
  customerRetention: null,
  ordersWithIssues: [],
  loading: false,
  error: null,
};
