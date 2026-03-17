import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AdminDashboardService } from './admin-dashboard.service';
import { environment } from '../../../environments/environment';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let http: HttpTestingController;
  const api = environment.urls.dashboardUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminDashboardService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRevenue() should call GET /dashboard/revenue', () => {
    service.getRevenue().subscribe();
    const req = http.expectOne(r => r.url === `${api}/revenue`);
    expect(req.request.method).toBe('GET');
    req.flush({ period: 'MONTHLY', totalRevenue: 0, totalOrders: 0, startDate: '', endDate: '' });
  });

  it('getOrderStats() should call GET /dashboard/orders/stats', () => {
    service.getOrderStats().subscribe();
    const req = http.expectOne(`${api}/orders/stats`);
    expect(req.request.method).toBe('GET');
    req.flush({ total: 0, pending: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, returned: 0 });
  });

  it('getLowStockProducts() should call GET /dashboard/products/low-stock', () => {
    service.getLowStockProducts().subscribe();
    const req = http.expectOne(r => r.url === `${api}/products/low-stock`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getPendingOrders() should call GET /dashboard/orders/pending', () => {
    service.getPendingOrders().subscribe();
    const req = http.expectOne(`${api}/orders/pending`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getTodaySummary() should call GET /dashboard/orders/today-summary', () => {
    service.getTodaySummary().subscribe();
    const req = http.expectOne(`${api}/orders/today-summary`);
    expect(req.request.method).toBe('GET');
    req.flush({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 });
  });

  it('getProductSummary() should call GET /dashboard/store/product-summary', () => {
    service.getProductSummary().subscribe();
    const req = http.expectOne(`${api}/store/product-summary`);
    expect(req.request.method).toBe('GET');
    req.flush({ activeProducts: 0, inactiveProducts: 0, outOfStockProducts: 0, totalProducts: 0 });
  });
});
