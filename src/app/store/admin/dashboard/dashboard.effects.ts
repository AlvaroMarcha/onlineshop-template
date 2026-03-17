import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminDashboardService } from '../../../services/admin/admin-dashboard.service';
import * as A from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private svc      = inject(AdminDashboardService);

  // ── SUPER_ADMIN ────────────────────────────────────────────────
  loadRevenue$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadRevenue),
    switchMap(() => this.svc.getRevenue().pipe(
      map(data => A.dashboardLoadRevenueSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadRevenueChart$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadRevenueChart),
    switchMap(() => this.svc.getRevenueChart().pipe(
      map(data => A.dashboardLoadRevenueChartSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadConversionRate$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadConversionRate),
    switchMap(() => this.svc.getConversionRate().pipe(
      map(data => A.dashboardLoadConversionRateSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadAverageOrderValue$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadAverageOrderValue),
    switchMap(() => this.svc.getAverageOrderValue().pipe(
      map(data => A.dashboardLoadAverageOrderValueSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── SUPER_ADMIN + ADMIN ────────────────────────────────────────
  loadOrderStats$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadOrderStats),
    switchMap(() => this.svc.getOrderStats().pipe(
      map(data => A.dashboardLoadOrderStatsSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadUserStats$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadUserStats),
    switchMap(() => this.svc.getUserStats().pipe(
      map(data => A.dashboardLoadUserStatsSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadTopSelling$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadTopSelling),
    switchMap(() => this.svc.getTopSellingProducts().pipe(
      map(data => A.dashboardLoadTopSellingSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadLowStock$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadLowStock),
    switchMap(() => this.svc.getLowStockProducts().pipe(
      map(data => A.dashboardLoadLowStockSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadPendingOrders$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadPendingOrders),
    switchMap(() => this.svc.getPendingOrders().pipe(
      map(data => A.dashboardLoadPendingOrdersSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadRecentInvoices$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadRecentInvoices),
    switchMap(() => this.svc.getRecentInvoices().pipe(
      map(data => A.dashboardLoadRecentInvoicesSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── ORDERS role ────────────────────────────────────────────────
  loadTodaySummary$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadTodaySummary),
    switchMap(() => this.svc.getTodaySummary().pipe(
      map(data => A.dashboardLoadTodaySummarySuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadOrderQueue$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadOrderQueue),
    switchMap(() => this.svc.getOrderQueue().pipe(
      map(data => A.dashboardLoadOrderQueueSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadPendingRefunds$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadPendingRefunds),
    switchMap(() => this.svc.getPendingRefunds().pipe(
      map(data => A.dashboardLoadPendingRefundsSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadDelayedShipments$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadDelayedShipments),
    switchMap(() => this.svc.getDelayedShipments().pipe(
      map(data => A.dashboardLoadDelayedShipmentsSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── STORE role ─────────────────────────────────────────────────
  loadProductSummary$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadProductSummary),
    switchMap(() => this.svc.getProductSummary().pipe(
      map(data => A.dashboardLoadProductSummarySuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadMostViewed$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadMostViewed),
    switchMap(() => this.svc.getMostViewedProducts().pipe(
      map(data => A.dashboardLoadMostViewedSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadBestRated$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadBestRated),
    switchMap(() => this.svc.getBestRatedProducts().pipe(
      map(data => A.dashboardLoadBestRatedSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadRecentReviews$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadRecentReviews),
    switchMap(() => this.svc.getRecentReviews().pipe(
      map(data => A.dashboardLoadRecentReviewsSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── CUSTOMERS_INVOICES role ────────────────────────────────────
  loadNewCustomers$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadNewCustomers),
    switchMap(() => this.svc.getNewCustomers().pipe(
      map(data => A.dashboardLoadNewCustomersSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadTopBuyers$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadTopBuyers),
    switchMap(() => this.svc.getTopBuyers().pipe(
      map(data => A.dashboardLoadTopBuyersSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadBannedCustomers$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadBannedCustomers),
    switchMap(() => this.svc.getBannedCustomers().pipe(
      map(data => A.dashboardLoadBannedCustomersSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  loadCustomerRetention$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadCustomerRetention),
    switchMap(() => this.svc.getCustomerRetention().pipe(
      map(data => A.dashboardLoadCustomerRetentionSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));

  // ── SUPPORT role ───────────────────────────────────────────────
  loadOrdersWithIssues$ = createEffect(() => this.actions$.pipe(
    ofType(A.dashboardLoadOrdersWithIssues),
    switchMap(() => this.svc.getOrdersWithIssues().pipe(
      map(data => A.dashboardLoadOrdersWithIssuesSuccess({ data })),
      catchError(err => of(A.dashboardLoadFailure({ error: err?.error?.message ?? err.message })))
    ))
  ));
}
