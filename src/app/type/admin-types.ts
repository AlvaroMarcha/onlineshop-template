/**
 * Admin Types — interfaces mapeadas desde los DTOs del backend.
 * Solo tipos del backoffice (dashboard, órdenes admin, etc.).
 * Los tipos de producto/usuario/inventario se añadirán en fases posteriores.
 */

// -----------------------------------------------
// Enums
// -----------------------------------------------

export enum OrderStatus {
  CREATED    = 'CREATED',
  PAID       = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED    = 'SHIPPED',
  DELIVERED  = 'DELIVERED',
  CANCELLED  = 'CANCELLED',
  RETURNED   = 'RETURNED',
}

export enum PaymentStatus {
  CREATED    = 'CREATED',
  PENDING    = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  SUCCESS    = 'SUCCESS',
  FAILED     = 'FAILED',
  CANCELLED  = 'CANCELLED',
  EXPIRED    = 'EXPIRED',
  REFUNDED   = 'REFUNDED',
}

export enum MovementType {
  IN         = 'IN',
  OUT        = 'OUT',
  SALE       = 'SALE',
  PURCHASE   = 'PURCHASE',
  RETURN     = 'RETURN',
  RESTOCK    = 'RESTOCK',
  ADJUSTMENT = 'ADJUSTMENT',
}

// -----------------------------------------------
// Utilidades de paginación
// -----------------------------------------------

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// -----------------------------------------------
// Dashboard — SUPER_ADMIN / ADMIN
// (GET /dashboard/*)
// -----------------------------------------------

/** GET /dashboard/revenue?period= */
export interface RevenueResponse {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  startDate: string;
  endDate: string;
}

/** Punto del gráfico de ingresos */
export interface RevenueChartPoint {
  label: string;
  revenue: number;
}

/** GET /dashboard/revenue/chart?period= */
export interface RevenueChartResponse {
  period: string;
  granularity: string;
  totalRevenue: number;
  chartData: RevenueChartPoint[];
}

/** GET /dashboard/conversion-rate */
export interface ConversionRateResponse {
  totalUsers: number;
  usersWithOrders: number;
  conversionRate: number;
  totalOrders: number;
}

/** GET /dashboard/average-order-value */
export interface AverageOrderValueResponse {
  averageOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
}

/** GET /dashboard/orders/stats */
export interface OrderStatsResponse {
  total: number;
  pending: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
}

/** GET /dashboard/users/stats?period= */
export interface UserStatsResponse {
  totalUsers: number;
  newUsers: number;
  period: string;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  bannedUsers: number;
}

/** GET /dashboard/products/top-selling?limit= */
export interface TopSellingProduct {
  productId: number;
  productName: string;
  slug: string;
  soldCount: number;
  currentStock: number;
  imageUrl: string | null;
}

/** GET /dashboard/products/low-stock?threshold= */
export interface LowStockProduct {
  productId: number;
  productName: string;
  slug: string;
  currentStock: number;
  soldCount: number;
  isActive: boolean;
  imageUrl: string | null;
}

/** GET /dashboard/orders/pending */
export interface PendingOrder {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  userId: number;
  userName: string;
  userEmail: string;
  itemCount: number;
}

/** GET /dashboard/invoices/recent?limit= */
export interface RecentInvoice {
  invoiceId: number;
  invoiceNumber: string;
  orderId: number;
  totalAmount: number;
  createdAt: string;
  userId: number;
  userName: string;
  userEmail: string;
}

// -----------------------------------------------
// Dashboard — ORDERS role
// (GET /dashboard/orders/*)
// -----------------------------------------------

/** GET /dashboard/orders/today-summary */
export interface TodayOrdersSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

/** GET /dashboard/orders/queue?limit= */
export interface OrderQueueItem {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  hoursSinceCreation: number;
}

/** GET /dashboard/orders/pending-refunds?limit= */
export interface PendingRefund {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  orderCreatedAt: string;
  customerName: string;
  customerEmail: string;
  stripePaymentIntentId: string | null;
}

/** GET /dashboard/orders/delayed-shipments?limit= */
export interface DelayedShipment {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  daysDelayed: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}

// -----------------------------------------------
// Dashboard — STORE role
// (GET /dashboard/store/*)
// -----------------------------------------------

/** GET /dashboard/store/product-summary */
export interface ProductSummary {
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  totalProducts: number;
}

/** GET /dashboard/store/most-viewed?limit= */
export interface MostViewedProduct {
  productId: number;
  name: string;
  sku: string;
  price: number;
  views: number;
  imageUrl: string | null;
  stock: number;
}

/** GET /dashboard/store/best-rated?limit= */
export interface BestRatedProduct {
  productId: number;
  name: string;
  sku: string;
  price: number;
  rating: number;
  imageUrl: string | null;
  stock: number;
}

/** GET /dashboard/store/recent-reviews?limit= */
export interface RecentReview {
  reviewId: number;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  productImageUrl: string | null;
}

// -----------------------------------------------
// Dashboard — CUSTOMERS_INVOICES role
// (GET /dashboard/customers/*)
// -----------------------------------------------

/** GET /dashboard/customers/new-customers */
export interface NewCustomer {
  userId: number;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
  hasOrders: boolean;
  orderCount: number;
}

/** GET /dashboard/customers/top-buyers?limit= */
export interface TopBuyer {
  userId: number;
  name: string;
  surname: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
}

/** GET /dashboard/customers/banned-customers */
export interface BannedCustomer {
  userId: number;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  orderCount: number;
}

/** GET /dashboard/customers/retention */
export interface CustomerRetention {
  totalCustomers: number;
  customersWithOrders: number;
  recurringCustomers: number;
  retentionRate: number;
  conversionRate: number;
}

// -----------------------------------------------
// Dashboard — SUPPORT role
// (GET /dashboard/support/*)
// -----------------------------------------------

/** GET /dashboard/support/orders-with-issues?limit= */
export interface OrderWithIssue {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemCount: number;
  hasFailedPayments: boolean;
  hasRefundedPayments: boolean;
  userId: number;
}
