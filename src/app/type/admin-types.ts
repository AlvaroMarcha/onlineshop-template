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

// -----------------------------------------------
// Productos admin
// (GET/POST/PUT/DELETE /products/*)
// -----------------------------------------------

/** Valor de un atributo (ej. "Rojo", "XL") */
export interface ProductAttribValue {
  id: number;
  value: string;
  active: boolean;
}

/** Atributo de producto (ej. "Color", "Talla") */
export interface ProductAttrib {
  id: number;
  name: string;
  active: boolean;
  values: ProductAttribValue[];
}

/** Imagen de producto */
export interface ProductImageAdmin {
  id: number;
  url: string;
  altText: string | null;
  isMain: boolean;
  sortOrder: number;
}

/** Variante de producto */
export interface ProductVariant {
  id: number;
  sku: string;
  price: number | null;
  stock: number;
  active: boolean;
  attributes: { attribId: number; valueId: number }[];
}

/**
 * DTO completo de producto para el backoffice.
 * Backend: ProductResponseDTO
 */
export interface ProductAdmin {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  discountPrice: number | null;
  taxRate: number;
  weight: number | null;
  isDigital: boolean;
  isFeatured: boolean;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  rating: number;
  ratingCount: number;
  soldCount: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  mainImageUrl: string | null;
  images: ProductImageAdmin[];
  categories: { id: number; name: string; slug: string }[];
  attribs: ProductAttrib[];
  variants: ProductVariant[];
}

/** Request para crear producto. Backend: ProductRequestDTO */
export interface ProductCreateRequest {
  name: string;
  sku: string;
  description: string;
  price: number;
  discountPrice: number | null;
  taxRate: number;
  weight: number | null;
  isDigital: boolean;
  isFeatured: boolean;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  lowStockThreshold: number;
  stock: number;
  categoryIds: number[];
}

/** Request para actualizar producto (todos los campos opcionales) */
export type ProductUpdateRequest = Partial<ProductCreateRequest>;

/** Parámetros de búsqueda paginada de productos (admin) */
export interface ProductSearchParams {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  newest?: boolean;
  includeInactive?: boolean;
  page?: number;
  size?: number;
}

// -----------------------------------------------
// Categorías admin
// (GET/POST/PUT/DELETE /categories/*)
// -----------------------------------------------

export interface SubcategoryAdmin {
  id: number;
  name: string;
  slug: string;
  active: boolean;
}

export interface CategoryAdmin {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  subcategories: SubcategoryAdmin[];
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
}

export interface SubcategoryCreateRequest {
  name: string;
  slug: string;
  categoryId: number;
}

// -----------------------------------------------
// Usuarios admin
// (GET/PUT /users/*)
// -----------------------------------------------

/**
 * DTO completo de usuario para el backoffice.
 * Backend: AdminUserResponseDTO
 */
export interface UserAdmin {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  roleName: string;
  roleId: number;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  lastLogin: string | null;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  locked: boolean;
  isDeleted: boolean;
  sessionCount: number;
}

export interface BannedUserResponse {
  userId: number;
  banned: boolean;
  bannedAt: string | null;
  bannedReason: string | null;
}

// -----------------------------------------------
// Pedidos admin
// (GET/POST /orders/admin/all | /orders/*)
// -----------------------------------------------

/** Parámetros de búsqueda paginada de pedidos (admin) */
export interface OrderSearchParams {
  page: number;
  size: number;
}

export interface OrderItemAdmin {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  taxRate: number;
  weight: number | null;
  isDigital: boolean;
  isFeatured: boolean;
}

export interface PaymentAdmin {
  id: number;
  orderId: number;
  status: PaymentStatus;
  amount: number;
  provider: string;
  transactionId: string | null;
  createdAt: string;
}

export interface OrderAddressAdmin {
  addressLine1: string;
  addressLine2: string | null;
  country: string;
  city: string;
  postalCode: string;
}

export interface OrderAdmin {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  paymentMethod: string;
  createdAt: string;
  payments: PaymentAdmin[];
  address: OrderAddressAdmin;
  orderItems: OrderItemAdmin[];
}

// -----------------------------------------------
// Facturas admin
// (GET /invoices/*)
// -----------------------------------------------

export interface InvoiceAdmin {
  id: number;
  invoiceNumber: string;
  orderId: number;
  userId: number;
  totalAmount: number;
  taxAmount: number;
  createdAt: string;
  userName: string;
  userEmail: string;
}

// -----------------------------------------------
// Inventario admin
// (GET/PUT /inventory/products/{id} | /inventory/movements)
// -----------------------------------------------

export interface InventoryAdmin {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  reservedQuantity: number;
  minStock: number;
  maxStock: number;
  incomingStock: number;
  damagedStock: number;
  lastRestockDate: string | null;
  updatedAt: string;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  movementType: MovementType;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface InventoryUpdateRequest {
  minStock: number;
  maxStock: number;
  incomingStock: number;
  damagedStock: number;
}

export interface InventoryMovementRequest {
  quantity: number;
  movementType: MovementType;
  notes: string | null;
}
