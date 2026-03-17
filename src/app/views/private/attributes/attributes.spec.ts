import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributesAdmin } from './attributes';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import {
  selectAdminProductAttribs,
  selectAdminProductLoading,
  selectAdminProductSaving,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import {
  adminProductsLoadAttribs,
  adminAttribCreate,
  adminAttribUpdate,
  adminAttribDelete,
  adminAttribValueCreate,
  adminAttribValueUpdate,
  adminAttribValueDelete,
} from '../../../store/admin/products/admin-products.actions';
import { ProductAttrib, ProductAttribValue } from '../../../type/admin-types';

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
  catalog: { categories: [], loading: false, saving: false, error: null },
};

const MOCK_VALUE: ProductAttribValue = { id: 100, value: 'Rojo', active: true };
const MOCK_ATTRIB: ProductAttrib = {
  id: 1, name: 'Color', active: true, values: [MOCK_VALUE],
};

describe('AttributesAdmin', () => {
  let fixture: ComponentFixture<AttributesAdmin>;
  let component: AttributesAdmin;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesAdmin, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({ initialState: INITIAL_STATE }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAdminProductAttribs, []);
    store.overrideSelector(selectAdminProductLoading, false);
    store.overrideSelector(selectAdminProductSaving,  false);
    store.overrideSelector(selectAdminProductError,   null);
    store.refreshState();

    fixture   = TestBed.createComponent(AttributesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('dispatches adminProductsLoadAttribs on init', () => {
      const spy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: adminProductsLoadAttribs.type }));
    });
  });

  describe('Signals', () => {
    it('allAttribs() returns [] initially', () => {
      expect(component.allAttribs()).toEqual([]);
    });

    it('attribs() filters by searchTerm', () => {
      store.overrideSelector(selectAdminProductAttribs, [MOCK_ATTRIB]);
      store.refreshState();
      fixture.detectChanges();
      component.searchTerm.set('col');
      expect(component.attribs().length).toBe(1);
      component.searchTerm.set('zzz');
      expect(component.attribs().length).toBe(0);
    });

    it('valueRows() returns values of selectedAttrib', () => {
      store.overrideSelector(selectAdminProductAttribs, [MOCK_ATTRIB]);
      store.refreshState();
      fixture.detectChanges();
      component.selectedAttrib.set(MOCK_ATTRIB);
      expect(component.valueRows().length).toBe(1);
    });

    it('valueRows() returns [] when no attrib selected', () => {
      expect(component.valueRows()).toEqual([]);
    });
  });

  describe('Attrib dialog', () => {
    it('openAttribCreateDialog() sets mode create and opens dialog', () => {
      component.openAttribCreateDialog();
      expect(component.attribDialogMode()).toBe('create');
      expect(component.attribDialogVisible()).toBeTrue();
    });

    it('openAttribEditDialog() sets mode edit and populates form', () => {
      component.openAttribEditDialog(MOCK_ATTRIB);
      expect(component.attribDialogMode()).toBe('edit');
      expect(component.attribForm.value.name).toBe(MOCK_ATTRIB.name);
      expect(component.attribDialogVisible()).toBeTrue();
    });

    it('submitAttrib() dispatches adminAttribCreate in create mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openAttribCreateDialog();
      component.attribForm.setValue({ name: 'Talla' });
      component.submitAttrib();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: adminAttribCreate.type, name: 'Talla' }));
      expect(component.attribDialogVisible()).toBeFalse();
    });

    it('submitAttrib() dispatches adminAttribUpdate in edit mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openAttribEditDialog(MOCK_ATTRIB);
      component.attribForm.setValue({ name: 'Color Updated' });
      component.submitAttrib();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: adminAttribUpdate.type }));
    });

    it('submitAttrib() does not dispatch when form is invalid', () => {
      const spy = spyOn(store, 'dispatch');
      component.openAttribCreateDialog();
      component.attribForm.setValue({ name: '' });
      component.submitAttrib();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Attrib delete', () => {
    it('confirmDeleteAttrib() dispatches adminAttribDelete', () => {
      const spy = spyOn(store, 'dispatch');
      component.deleteAttribTarget.set(MOCK_ATTRIB);
      component.deleteAttribDialogVisible.set(true);
      component.confirmDeleteAttrib();
      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: adminAttribDelete.type, id: MOCK_ATTRIB.id }));
      expect(component.deleteAttribDialogVisible()).toBeFalse();
    });

    it('confirmDeleteAttrib() clears selectedAttrib if same attrib deleted', () => {
      component.selectedAttrib.set(MOCK_ATTRIB);
      component.deleteAttribTarget.set(MOCK_ATTRIB);
      component.confirmDeleteAttrib();
      expect(component.selectedAttrib()).toBeNull();
    });
  });

  describe('Value dialog', () => {
    beforeEach(() => {
      component.selectedAttrib.set(MOCK_ATTRIB);
    });

    it('openValueCreateDialog() sets mode create and opens dialog', () => {
      component.openValueCreateDialog();
      expect(component.valueDialogMode()).toBe('create');
      expect(component.valueDialogVisible()).toBeTrue();
    });

    it('submitValue() dispatches adminAttribValueCreate', () => {
      const spy = spyOn(store, 'dispatch');
      component.openValueCreateDialog();
      component.valueForm.setValue({ value: 'Azul' });
      component.submitValue();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminAttribValueCreate.type, attribId: MOCK_ATTRIB.id, value: 'Azul' })
      );
    });

    it('submitValue() dispatches adminAttribValueUpdate in edit mode', () => {
      const spy = spyOn(store, 'dispatch');
      component.openValueEditDialog(MOCK_VALUE);
      component.valueForm.setValue({ value: 'Verde' });
      component.submitValue();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminAttribValueUpdate.type })
      );
    });

    it('submitValue() does not dispatch if no attrib selected', () => {
      component.selectedAttrib.set(null);
      const spy = spyOn(store, 'dispatch');
      component.openValueCreateDialog();
      component.valueForm.setValue({ value: 'Azul' });
      component.submitValue();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Value delete', () => {
    it('confirmDeleteValue() dispatches adminAttribValueDelete', () => {
      const spy = spyOn(store, 'dispatch');
      component.selectedAttrib.set(MOCK_ATTRIB);
      component.deleteValueTarget.set(MOCK_VALUE);
      component.deleteValueDialogVisible.set(true);
      component.confirmDeleteValue();
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({ type: adminAttribValueDelete.type, attribId: MOCK_ATTRIB.id, valueId: MOCK_VALUE.id })
      );
      expect(component.deleteValueDialogVisible()).toBeFalse();
    });
  });

  describe('onAttribAction()', () => {
    it('sets selectedAttrib when action is Valores', () => {
      component.onAttribAction({
        action: { label: 'Valores', icon: 'list', severity: 'info' },
        row: MOCK_ATTRIB as unknown as Record<string, unknown>,
      });
      expect(component.selectedAttrib()?.id).toBe(MOCK_ATTRIB.id);
    });

    it('opens edit dialog when action is Editar', () => {
      component.onAttribAction({
        action: { label: 'Editar', icon: 'edit', severity: 'primary' },
        row: MOCK_ATTRIB as unknown as Record<string, unknown>,
      });
      expect(component.attribDialogVisible()).toBeTrue();
      expect(component.attribDialogMode()).toBe('edit');
    });

    it('opens delete dialog when action is Eliminar', () => {
      component.onAttribAction({
        action: { label: 'Eliminar', icon: 'delete', severity: 'danger' },
        row: MOCK_ATTRIB as unknown as Record<string, unknown>,
      });
      expect(component.deleteAttribDialogVisible()).toBeTrue();
    });
  });
});
