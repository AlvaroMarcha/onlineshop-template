import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  selectAdminProductSelected,
  selectAdminProductAttribs,
  selectAdminProductLoading,
  selectAdminProductSaving,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import {
  adminProductLoad,
  adminProductCreate,
  adminProductUpdate,
  adminProductClear,
  adminProductsLoadAttribs,
} from '../../../store/admin/products/admin-products.actions';
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
  id: 7, name: 'Zapatilla Pro', sku: 'ZAP-001', description: 'Cómoda zapatilla',
  price: 79.99, discountPrice: 59.99, taxRate: 21, categories: [],
  weight: 0.8, isDigital: false, isFeatured: true, slug: 'zapatilla-pro',
  metaTitle: 'Zapatilla Pro', metaDescription: 'La mejor zapatilla',
  rating: 4.5, ratingCount: 22, soldCount: 120,
  stock: 15, lowStockThreshold: 5, isActive: true, mainImageUrl: null,
  images: [], attribs: [], variants: [],
};

function makeRoute(id: string | null) {
  return {
    snapshot: { paramMap: { get: () => id } },
  };
}

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  let component: ProductForm;
  let store: MockStore;

  const setup = async (routeId: string | null = null) => {
    await TestBed.configureTestingModule({
      imports: [ProductForm, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
        { provide: ActivatedRoute, useValue: makeRoute(routeId) },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminProductSelected, null);
    store.overrideSelector(selectAdminProductAttribs,  []);
    store.overrideSelector(selectAdminProductLoading,  false);
    store.overrideSelector(selectAdminProductSaving,   false);
    store.overrideSelector(selectAdminProductError,    null);
    store.refreshState();

    fixture   = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => store?.resetSelectors());

  describe('Modo creación (sin id)', () => {
    beforeEach(async () => setup(null));

    it('should create', () => expect(component).toBeTruthy());

    it('isEdit() is false', () => expect(component.isEdit()).toBeFalse());

    it('dispatches loadAttribs on init', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(adminProductsLoadAttribs());
    });

    it('does NOT dispatch adminProductLoad when no id', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).not.toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductLoad.type })
      );
    });

    it('form is invalid when empty required fields', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('dispatches adminProductCreate on valid submit', () => {
      const spy = spyOn(store, 'dispatch');
      component.form.patchValue({
        name: 'Nuevo Producto', price: 10, taxRate: 21, stock: 5,
        lowStockThreshold: 2, description: '', isDigital: false, isFeatured: false,
      });
      component.submit();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductCreate.type })
      );
    });

    it('does NOT dispatch on invalid submit', () => {
      const spy = spyOn(store, 'dispatch');
      component.form.patchValue({ name: '' });
      component.submit();
      expect(spy).not.toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductCreate.type })
      );
    });
  });

  describe('Modo edición (con id)', () => {
    beforeEach(async () => setup('7'));

    it('isEdit() is true', () => expect(component.isEdit()).toBeTrue());

    it('dispatches adminProductLoad with correct id', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(adminProductLoad({ id: 7 }));
    });

    it('populates form when selected product is emitted', () => {
      store.overrideSelector(selectAdminProductSelected, MOCK_PRODUCT);
      store.refreshState();
      // Re-init to trigger subscribe
      component.ngOnInit();
      expect(component.form.get('name')?.value).toBe(MOCK_PRODUCT.name);
      expect(component.form.get('price')?.value).toBe(MOCK_PRODUCT.price);
    });

    it('dispatches adminProductUpdate on valid submit in edit mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.startEditing(); // Habilitar edición (patrón view-first)
      component.form.patchValue({
        name: 'Updated', price: 99, taxRate: 21, stock: 10,
        lowStockThreshold: 3, description: '', isDigital: false, isFeatured: false,
      });
      component.submit();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminProductUpdate.type })
      );
    });

    it('dispatches adminProductClear on destroy', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalledWith(adminProductClear());
    });
  });

  describe('isInvalid()', () => {
    beforeEach(async () => setup(null));

    it('returns false when field is untouched', () => {
      expect(component.isInvalid('name')).toBeFalse();
    });

    it('returns true when required field is touched and empty', () => {
      const ctrl = component.form.get('name')!;
      ctrl.markAsTouched();
      ctrl.setValue('');
      expect(component.isInvalid('name')).toBeTrue();
    });
  });
});
