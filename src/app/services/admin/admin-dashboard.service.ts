import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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
} from '../../type/admin-types';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly api = environment.urls.dashboardUrl;

  constructor(private http: HttpClient) {}

  // ── SUPER_ADMIN ──────────────────────────────────────────────
  getRevenue(period = 'MONTHLY'): Observable<RevenueResponse> {
    return this.http.get<RevenueResponse>(`${this.api}/revenue`, { params: { period } });
  }

  getRevenueChart(period = 'MONTHLY'): Observable<RevenueChartResponse> {
    return this.http.get<RevenueChartResponse>(`${this.api}/revenue/chart`, { params: { period } });
  }

  getConversionRate(): Observable<ConversionRateResponse> {
    return this.http.get<ConversionRateResponse>(`${this.api}/conversion-rate`);
  }

  getAverageOrderValue(): Observable<AverageOrderValueResponse> {
    return this.http.get<AverageOrderValueResponse>(`${this.api}/average-order-value`);
  }

  // ── SUPER_ADMIN + ADMIN ──────────────────────────────────────
  getOrderStats(): Observable<OrderStatsResponse> {
    return this.http.get<OrderStatsResponse>(`${this.api}/orders/stats`);
  }

  getUserStats(period = 'MONTHLY'): Observable<UserStatsResponse> {
    return this.http.get<UserStatsResponse>(`${this.api}/users/stats`, { params: { period } });
  }

  getTopSellingProducts(limit = 5): Observable<TopSellingProduct[]> {
    return this.http.get<TopSellingProduct[]>(`${this.api}/products/top-selling`, { params: { limit } });
  }

  getLowStockProducts(threshold = 10): Observable<LowStockProduct[]> {
    return this.http.get<LowStockProduct[]>(`${this.api}/products/low-stock`, { params: { threshold } });
  }

  getPendingOrders(): Observable<PendingOrder[]> {
    return this.http.get<PendingOrder[]>(`${this.api}/orders/pending`);
  }

  getRecentInvoices(limit = 5): Observable<RecentInvoice[]> {
    return this.http.get<RecentInvoice[]>(`${this.api}/invoices/recent`, { params: { limit } });
  }

  // ── ORDERS role ───────────────────────────────────────────────
  getTodaySummary(): Observable<TodayOrdersSummary> {
    return this.http.get<TodayOrdersSummary>(`${this.api}/orders/today-summary`);
  }

  getOrderQueue(limit = 10): Observable<OrderQueueItem[]> {
    return this.http.get<OrderQueueItem[]>(`${this.api}/orders/queue`, { params: { limit } });
  }

  getPendingRefunds(limit = 10): Observable<PendingRefund[]> {
    return this.http.get<PendingRefund[]>(`${this.api}/orders/pending-refunds`, { params: { limit } });
  }

  getDelayedShipments(limit = 10): Observable<DelayedShipment[]> {
    return this.http.get<DelayedShipment[]>(`${this.api}/orders/delayed-shipments`, { params: { limit } });
  }

  // ── STORE role ────────────────────────────────────────────────
  getProductSummary(): Observable<ProductSummary> {
    return this.http.get<ProductSummary>(`${this.api}/store/product-summary`);
  }

  getMostViewedProducts(limit = 5): Observable<MostViewedProduct[]> {
    return this.http.get<MostViewedProduct[]>(`${this.api}/store/most-viewed`, { params: { limit } });
  }

  getBestRatedProducts(limit = 5): Observable<BestRatedProduct[]> {
    return this.http.get<BestRatedProduct[]>(`${this.api}/store/best-rated`, { params: { limit } });
  }

  getRecentReviews(limit = 5): Observable<RecentReview[]> {
    return this.http.get<RecentReview[]>(`${this.api}/store/recent-reviews`, { params: { limit } });
  }

  // ── CUSTOMERS_INVOICES role ───────────────────────────────────
  getNewCustomers(period = 'MONTHLY', limit = 10): Observable<NewCustomer[]> {
    return this.http.get<NewCustomer[]>(`${this.api}/customers/new-customers`, { params: { period, limit } });
  }

  getTopBuyers(limit = 10): Observable<TopBuyer[]> {
    return this.http.get<TopBuyer[]>(`${this.api}/customers/top-buyers`, { params: { limit } });
  }

  getBannedCustomers(): Observable<BannedCustomer[]> {
    return this.http.get<BannedCustomer[]>(`${this.api}/customers/banned-customers`);
  }

  getCustomerRetention(): Observable<CustomerRetention> {
    return this.http.get<CustomerRetention>(`${this.api}/customers/retention`);
  }

  // ── SUPPORT role ──────────────────────────────────────────────
  getOrdersWithIssues(limit = 10): Observable<OrderWithIssue[]> {
    return this.http.get<OrderWithIssue[]>(`${this.api}/support/orders-with-issues`, { params: { limit } });
  }
}
