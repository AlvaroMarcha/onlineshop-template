import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesAdmin } from './categories';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import {
  selectAdminCatalogCategories,
  selectAdminCatalogLoading,
  selectAdminCatalogSaving,
  selectAdminCatalogToggling,
  selectAdminCatalogError,
} from '../../../store/admin/catalog/admin-catalog.selectors';
import {
  adminCatalogLoad,
  adminCategoryCreate,
  adminCategoryUpdate,
  adminCategoryDelete,
  adminCategoryToggle,
  adminSubcategoryCreate,
  adminSubcategoryUpdate,
  adminSubcategoryDelete,
  adminSubcategoryToggle,
} from '../../../store/admin/catalog/admin-catalog.actions';
import { CategoryAdmin, SubcategoryAdmin } from '../../../type/admin-types';

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
    loading: false, saving: false, toggling: false, error: null,
  },
  catalog: { categories: [], loading: false, saving: false, toggling: false, error: null },
};

const MOCK_SUB: SubcategoryAdmin = { id: 10, name: 'Sub A', slug: 'sub-a', active: true };
const MOCK_CAT: CategoryAdmin = {
  id: 1, name: 'Cat A', slug: 'cat-a', active: true, subcategories: [MOCK_SUB],
};

describe('CategoriesAdmin', () => {
  let fixture: ComponentFixture<CategoriesAdmin>;
  let component: CategoriesAdmin;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesAdmin, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminCatalogCategories, []);
    store.overrideSelector(selectAdminCatalogLoading,    false);
    store.overrideSelector(selectAdminCatalogSaving,     false);
    store.overrideSelector(selectAdminCatalogToggling,   false);
    store.overrideSelector(selectAdminCatalogError,      null);
    store.refreshState();

    fixture   = TestBed.createComponent(CategoriesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('dispatches adminCatalogLoad on init', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: adminCatalogLoad.type }));
    });
  });

  describe('Signals', () => {
    it('allCategories() returns [] initially', () => {
      expect(component.allCategories()).toEqual([]);
    });

    it('categories() filters by searchTerm', () => {
      store.overrideSelector(selectAdminCatalogCategories, [MOCK_CAT]);
      store.refreshState();
      fixture.detectChanges();
      component.searchTerm.set('cat');
      expect(component.categories().length).toBe(1);
      component.searchTerm.set('zzz');
      expect(component.categories().length).toBe(0);
    });

    it('subcategoryRows() returns subcategories of selectedCategory', () => {
      store.overrideSelector(selectAdminCatalogCategories, [MOCK_CAT]);
      store.refreshState();
      fixture.detectChanges();
      component.selectedCategory.set(MOCK_CAT);
      expect(component.subcategoryRows().length).toBe(1);
    });

    it('subcategoryRows() returns [] when no category selected', () => {
      expect(component.subcategoryRows()).toEqual([]);
    });
  });

  describe('Category dialog', () => {
    it('openCategoryCreateDialog() sets mode create and opens dialog', () => {
      component.openCategoryCreateDialog();
      expect(component.categoryDialogMode()).toBe('create');
      expect(component.categoryDialogVisible()).toBeTrue();
    });

    it('openCategoryEditDialog() sets mode edit and populates form', () => {
      component.openCategoryEditDialog(MOCK_CAT);
      expect(component.categoryDialogMode()).toBe('edit');
      expect(component.categoryForm.value.name).toBe(MOCK_CAT.name);
      expect(component.categoryDialogVisible()).toBeTrue();
    });

    it('submitCategory() dispatches adminCategoryCreate in create mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openCategoryCreateDialog();
      component.categoryForm.setValue({ name: 'New Cat' });
      component.submitCategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminCategoryCreate.type })
      );
      expect(component.categoryDialogVisible()).toBeFalse();
    });

    it('submitCategory() dispatches adminCategoryUpdate in edit mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openCategoryEditDialog(MOCK_CAT);
      component.categoryForm.setValue({ name: 'Updated' });
      component.submitCategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminCategoryUpdate.type })
      );
    });

    it('submitCategory() does not dispatch when form is invalid', () => {
      const spy = spyOn(store, 'dispatch');
      component.openCategoryCreateDialog();
      component.categoryForm.setValue({ name: '' });
      component.submitCategory();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Category delete', () => {
    it('confirmDeleteCategory() dispatches adminCategoryDelete', () => {
      const spy = spyOn(store, 'dispatch');
      component.deleteCategoryTarget.set(MOCK_CAT);
      component.deleteCategoryDialogVisible.set(true);
      component.confirmDeleteCategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminCategoryDelete.type, id: MOCK_CAT.id })
      );
      expect(component.deleteCategoryDialogVisible()).toBeFalse();
    });

    it('confirmDeleteCategory() clears selectedCategory if same category deleted', () => {
      component.selectedCategory.set(MOCK_CAT);
      component.deleteCategoryTarget.set(MOCK_CAT);
      component.confirmDeleteCategory();
      expect(component.selectedCategory()).toBeNull();
    });
  });

  describe('Category toggle', () => {
    it('onCategoryToggle() dispatches adminCategoryToggle', () => {
      const spy = spyOn(store, 'dispatch');
      component.onCategoryToggle({
        row: MOCK_CAT as unknown as Record<string, unknown>,
        field: 'active', value: false,
      });
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminCategoryToggle.type, id: MOCK_CAT.id })
      );
    });
  });

  describe('Subcategory dialog', () => {
    beforeEach(() => {
      component.selectedCategory.set(MOCK_CAT);
    });

    it('openSubcategoryCreateDialog() sets mode create and opens dialog', () => {
      component.openSubcategoryCreateDialog();
      expect(component.subcategoryDialogMode()).toBe('create');
      expect(component.subcategoryDialogVisible()).toBeTrue();
    });

    it('submitSubcategory() dispatches adminSubcategoryCreate', () => {
      const spy = spyOn(store, 'dispatch');
      component.openSubcategoryCreateDialog();
      component.subcategoryForm.setValue({ name: 'New Sub' });
      component.submitSubcategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminSubcategoryCreate.type })
      );
    });

    it('submitSubcategory() dispatches adminSubcategoryUpdate in edit mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openSubcategoryEditDialog(MOCK_SUB);
      component.subcategoryForm.setValue({ name: 'Updated' });
      component.submitSubcategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminSubcategoryUpdate.type })
      );
    });
  });

  describe('Subcategory delete', () => {
    it('confirmDeleteSubcategory() dispatches adminSubcategoryDelete', () => {
      const spy = spyOn(store, 'dispatch');
      component.selectedCategory.set(MOCK_CAT);
      component.deleteSubcategoryTarget.set(MOCK_SUB);
      component.deleteSubcategoryDialogVisible.set(true);
      component.confirmDeleteSubcategory();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminSubcategoryDelete.type })
      );
      expect(component.deleteSubcategoryDialogVisible()).toBeFalse();
    });
  });

  describe('Subcategory toggle', () => {
    it('onSubcategoryToggle() dispatches adminSubcategoryToggle', () => {
      const spy = spyOn(store, 'dispatch');
      component.selectedCategory.set(MOCK_CAT);
      component.onSubcategoryToggle({
        row: MOCK_SUB as unknown as Record<string, unknown>,
        field: 'active', value: false,
      });
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminSubcategoryToggle.type, id: MOCK_SUB.id, categoryId: MOCK_CAT.id })
      );
    });

    it('onSubcategoryToggle() does nothing when no category selected', () => {
      const spy = spyOn(store, 'dispatch');
      component.selectedCategory.set(null);
      component.onSubcategoryToggle({
        row: MOCK_SUB as unknown as Record<string, unknown>,
        field: 'active', value: false,
      });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onCategoryAction()', () => {
    it('sets selectedCategory when action is Subcategorías', () => {
      component.onCategoryAction({
        action: { label: 'Subcategorías', icon: 'category', severity: 'info' },
        row: MOCK_CAT as unknown as Record<string, unknown>,
      });
      expect(component.selectedCategory()?.id).toBe(MOCK_CAT.id);
    });

    it('opens edit dialog when action is Editar', () => {
      component.onCategoryAction({
        action: { label: 'Editar', icon: 'edit', severity: 'primary' },
        row: MOCK_CAT as unknown as Record<string, unknown>,
      });
      expect(component.categoryDialogVisible()).toBeTrue();
      expect(component.categoryDialogMode()).toBe('edit');
    });
  });
});
