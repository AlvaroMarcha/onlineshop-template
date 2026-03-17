import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsAdmin } from './products';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import {
  selectAdminProductsList,
  selectAdminProductsTotal,
  selectAdminProductsPage,
  selectAdminProductLoading,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import { adminProductsSearch, adminProductDelete } from '../../../store/admin/products/admin-products.actions';
import { ProductAdmin } from '../../../type/admin-types';

const INITIAL_STATE = {
  auth: { token: null, user: null, loading: false, error: null, refreshToken: null },
  dashboard: {
    revenue: null, revenueChart: null, conversionRate: null, averageOrderValue: null,
    orderStats: null, userStats: null, topSellingProducts: [], lowStockProducts: [],
    pendingOrders: [], recentInvoices: [], todayOrdersSummary: null, orderQueue: [],
    pendingRefunds: [], delayedShipments: [], productSummary: null,
    mostViewedProducts: [], bestRatedProducts: [], recentReviews: [],
    newCustomers: [], topBuyers: [], bannedCustomers: [], customerRetention: null,
    ordersWithIssues: [], loading: false, error: null,
  },
  adminProducts: {
    page: null, selected: null, attribs: [],
    searchParams: { page: 0, size: 20, includeInactive: true },
    loading: false, saving: false, error: null,
  },
};

const MOCK_PRODUCT: ProductAdmin = {
  id: 1, name: 'Producto Test', sku: 'SKU-001', description: 'Desc', price: 49.99,
  discountPrice: null, taxRate: 21, categories: [], weight: 0.5,
  isDigital: false, isFeatured: false, slug: 'producto-test',
  metaTitle: null, metaDescription: null, rating: 0, ratingCount: 0, soldCount: 0,
  stock: 10, lowStockThreshold: 3, isActive: true, mainImageUrl: null,
  images: [], attribs: [], variants: [],
};

describe('ProductsAdmin', () => {
  let fixture: ComponentFixture<ProductsAdmin>;
  let component: ProductsAdmin;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsAdmin, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminProductsList,  []);
    store.overrideSelector(selectAdminProductsTotal, 0);
    store.overrideSelector(selectAdminProductsPage,  null);
    store.overrideSelector(selectAdminProductLoading, false);
    store.overrideSelector(selectAdminProductError,   null);
    store.refreshState();

    fixture   = TestBed.createComponent(ProductsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('dispatches adminProductsSearch on init', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductsSearch.type })
      );
    });
  });

  describe('Signals', () => {
    it('products() returns empty array initially', () => {
      expect(component.products()).toEqual([]);
    });

    it('total() returns 0 initially', () => {
      expect(component.total()).toBe(0);
    });

    it('loading() returns false initially', () => {
      expect(component.loading()).toBeFalse();
    });

    it('totalPages() is 0 when total is 0', () => {
      expect(component.totalPages()).toBe(0);
    });
  });

  describe('Delete flow', () => {
    it('openDeleteDialog() sets deleteTarget and shows dialog', () => {
      component['deleteTarget'].set(MOCK_PRODUCT);
      component['deleteDialogVisible'].set(true);
      expect(component['deleteTarget']()).toEqual(MOCK_PRODUCT);
      expect(component['deleteDialogVisible']()).toBeTrue();
    });

    it('cancelDelete() hides dialog and clears target', () => {
      component['deleteTarget'].set(MOCK_PRODUCT);
      component['deleteDialogVisible'].set(true);
      component.cancelDelete();
      expect(component['deleteDialogVisible']()).toBeFalse();
      expect(component['deleteTarget']()).toBeNull();
    });

    it('confirmDelete() dispatches adminProductDelete and hides dialog', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component['deleteTarget'].set(MOCK_PRODUCT);
      component['deleteDialogVisible'].set(true);
      component.confirmDelete();
      expect(dispatchSpy).toHaveBeenCalledWith(adminProductDelete({ id: MOCK_PRODUCT.id }));
      expect(component['deleteDialogVisible']()).toBeFalse();
    });

    it('confirmDelete() does nothing if no target', () => {
      const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
      component['deleteTarget'].set(null);
      component.confirmDelete();
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductDelete.type })
      );
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      store.overrideSelector(selectAdminProductsTotal, 60);
      store.refreshState();
      fixture.detectChanges();
    });

    it('totalPages() is 3 for 60 items with size 20', () => {
      expect(component.totalPages()).toBe(3);
    });

    it('prevPage() does nothing on first page', () => {
      component['pageIndex'].set(0);
      const dispatchSpy = spyOn(store, 'dispatch');
      component.prevPage();
      expect(component['pageIndex']()).toBe(0);
    });

    it('nextPage() advances page', () => {
      component['pageIndex'].set(0);
      const dispatchSpy = spyOn(store, 'dispatch');
      component.nextPage();
      expect(component['pageIndex']()).toBe(1);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('goToPage() sets pageIndex and dispatches', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.goToPage(2);
      expect(component['pageIndex']()).toBe(2);
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('onAction()', () => {
    it('opens delete dialog when action is Eliminar', () => {
      const mockAction = { label: 'Eliminar', icon: 'delete', severity: 'danger' as const };
      component.onAction({ action: mockAction, row: MOCK_PRODUCT as unknown as Record<string, unknown> });
      expect(component['deleteDialogVisible']()).toBeTrue();
      expect(component['deleteTarget']()?.id).toBe(MOCK_PRODUCT.id);
    });
  });
});
