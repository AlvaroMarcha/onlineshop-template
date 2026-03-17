import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardLoading       = createSelector(selectDashboardState, s => s.loading);
export const selectDashboardError         = createSelector(selectDashboardState, s => s.error);

// SUPER_ADMIN
export const selectRevenue                = createSelector(selectDashboardState, s => s.revenue);
export const selectRevenueChart           = createSelector(selectDashboardState, s => s.revenueChart);
export const selectConversionRate         = createSelector(selectDashboardState, s => s.conversionRate);
export const selectAverageOrderValue      = createSelector(selectDashboardState, s => s.averageOrderValue);

// SUPER_ADMIN + ADMIN
export const selectOrderStats             = createSelector(selectDashboardState, s => s.orderStats);
export const selectUserStats              = createSelector(selectDashboardState, s => s.userStats);
export const selectTopSellingProducts     = createSelector(selectDashboardState, s => s.topSellingProducts);
export const selectLowStockProducts       = createSelector(selectDashboardState, s => s.lowStockProducts);
export const selectPendingOrders          = createSelector(selectDashboardState, s => s.pendingOrders);
export const selectRecentInvoices         = createSelector(selectDashboardState, s => s.recentInvoices);

// ORDERS
export const selectTodayOrdersSummary     = createSelector(selectDashboardState, s => s.todayOrdersSummary);
export const selectOrderQueue             = createSelector(selectDashboardState, s => s.orderQueue);
export const selectPendingRefunds         = createSelector(selectDashboardState, s => s.pendingRefunds);
export const selectDelayedShipments       = createSelector(selectDashboardState, s => s.delayedShipments);

// STORE
export const selectProductSummary         = createSelector(selectDashboardState, s => s.productSummary);
export const selectMostViewedProducts     = createSelector(selectDashboardState, s => s.mostViewedProducts);
export const selectBestRatedProducts      = createSelector(selectDashboardState, s => s.bestRatedProducts);
export const selectRecentReviews          = createSelector(selectDashboardState, s => s.recentReviews);

// CUSTOMERS_INVOICES
export const selectNewCustomers           = createSelector(selectDashboardState, s => s.newCustomers);
export const selectTopBuyers              = createSelector(selectDashboardState, s => s.topBuyers);
export const selectBannedCustomers        = createSelector(selectDashboardState, s => s.bannedCustomers);
export const selectCustomerRetention      = createSelector(selectDashboardState, s => s.customerRetention);

// SUPPORT
export const selectOrdersWithIssues       = createSelector(selectDashboardState, s => s.ordersWithIssues);
