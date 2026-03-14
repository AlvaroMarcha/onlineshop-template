import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MDataview, MDataviewLayout, MDataviewSortOption } from './m-dataview';

interface TestItem { id: number; name: string; price: number; }

const ITEMS: TestItem[] = [
  { id: 1, name: 'Zapatillas', price: 59 },
  { id: 2, name: 'Camiseta',   price: 19 },
  { id: 3, name: 'Pantalón',   price: 39 },
  { id: 4, name: 'Bufanda',    price: 15 },
  { id: 5, name: 'Gorra',      price: 22 },
];

const SORT_OPTS: MDataviewSortOption[] = [
  { label: 'Precio ↑', value: 'price', direction: 'asc'  },
  { label: 'Precio ↓', value: 'price', direction: 'desc' },
  { label: 'Nombre',   value: 'name',  direction: 'asc'  },
];

describe('MDataview', () => {
  let fixture: ComponentFixture<MDataview>;
  let component: MDataview;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MDataview] }).compileComponents();
    fixture = TestBed.createComponent(MDataview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  // ─── Layout ───────────────────────────────────────────────
  it('should start with grid layout by default', () => {
    expect(component._layout()).toBe('grid');
  });

  it('setLayout("list") sets internal layout signal', () => {
    component.setLayout('list');
    expect(component._layout()).toBe('list');
  });

  it('setLayout("grid") reverts to grid', () => {
    component.setLayout('list');
    component.setLayout('grid');
    expect(component._layout()).toBe('grid');
  });

  it('setLayout emits layoutChange', () => {
    const emitted: MDataviewLayout[] = [];
    component.layoutChange.subscribe(v => emitted.push(v));
    component.setLayout('list');
    expect(emitted).toEqual(['list']);
  });

  it('external layout input syncs to internal signal', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component._layout()).toBe('list');
  });

  // ─── Skeleton / Loading ───────────────────────────────────
  it('_skeletonArray length matches skeletonCount', () => {
    fixture.componentRef.setInput('skeletonCount', 6);
    expect(component._skeletonArray().length).toBe(6);
  });

  it('shows correct default skeletonCount of 8', () => {
    expect(component._skeletonArray().length).toBe(8);
  });

  // ─── Empty state ──────────────────────────────────────────
  it('_sortedItems is empty when items is []', () => {
    fixture.componentRef.setInput('items', []);
    expect(component._sortedItems().length).toBe(0);
  });

  it('default emptyMessage is "No hay datos disponibles"', () => {
    expect(component.emptyMessage()).toBe('No hay datos disponibles');
  });

  it('custom emptyMessage is reflected', () => {
    fixture.componentRef.setInput('emptyMessage', 'Sin resultados');
    expect(component.emptyMessage()).toBe('Sin resultados');
  });

  // ─── Items / Sort ─────────────────────────────────────────
  it('_sortedItems returns all items when no sort selected', () => {
    fixture.componentRef.setInput('items', ITEMS);
    expect(component._sortedItems().length).toBe(ITEMS.length);
  });

  it('_sortedItems sorts by price asc', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('sortOptions', SORT_OPTS);
    component._sortValue.set('price');
    const prices = component._sortedItems().map((i: unknown) => (i as TestItem).price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('_sortedItems sorts by name asc', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('sortOptions', [SORT_OPTS[2]]);
    component._sortValue.set('name');
    const names = component._sortedItems().map((i: unknown) => (i as TestItem).name);
    expect(names).toEqual([...names].sort());
  });

  it('onSortChange updates _sortValue', () => {
    fixture.componentRef.setInput('sortOptions', SORT_OPTS);
    component.onSortChange('price');
    expect(component._sortValue()).toBe('price');
  });

  it('onSortChange emits sortChange with matching option', () => {
    fixture.componentRef.setInput('sortOptions', SORT_OPTS);
    const emitted: (MDataviewSortOption | null)[] = [];
    component.sortChange.subscribe(v => emitted.push(v));
    component.onSortChange('name');
    expect(emitted[0]).toEqual(SORT_OPTS[2]);
  });

  it('onSortChange emits null when value is empty', () => {
    fixture.componentRef.setInput('sortOptions', SORT_OPTS);
    const emitted: (MDataviewSortOption | null)[] = [];
    component.sortChange.subscribe(v => emitted.push(v));
    component.onSortChange('');
    expect(emitted[0]).toBeNull();
  });

  // ─── Paginación ───────────────────────────────────────────
  it('_totalPages with 5 items and rows=2 is 3', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    expect(component._totalPages()).toBe(3);
  });

  it('_pagedItems returns only first page slice', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    expect(component._pagedItems().length).toBe(2);
  });

  it('setPage changes _currentPage', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    component.setPage(2);
    expect(component._currentPage()).toBe(2);
  });

  it('setPage emits pageChange', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    const emitted: number[] = [];
    component.pageChange.subscribe(v => emitted.push(v));
    component.setPage(2);
    expect(emitted).toEqual([2]);
  });

  it('setPage with "..." does nothing', () => {
    component._currentPage.set(1);
    component.setPage('...');
    expect(component._currentPage()).toBe(1);
  });

  it('prevPage does nothing on first page', () => {
    component._currentPage.set(1);
    component.prevPage();
    expect(component._currentPage()).toBe(1);
  });

  it('nextPage does nothing on last page', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 5);
    component._currentPage.set(1);
    component.nextPage();
    expect(component._currentPage()).toBe(1);
  });

  it('nextPage navigates to next page', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    component._currentPage.set(1);
    component.nextPage();
    expect(component._currentPage()).toBe(2);
  });

  it('prevPage goes back one page', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    component._currentPage.set(3);
    component.prevPage();
    expect(component._currentPage()).toBe(2);
  });

  it('items change resets page to 1', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    component._currentPage.set(2);
    fixture.componentRef.setInput('items', [ITEMS[0]]);
    fixture.detectChanges();
    expect(component._currentPage()).toBe(1);
  });

  it('_pagedItems returns all items when paginator is false', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 2);
    fixture.componentRef.setInput('paginator', false);
    expect(component._pagedItems().length).toBe(ITEMS.length);
  });

  // ─── _pageNumbers con ellipsis ────────────────────────────
  it('_pageNumbers returns 1..totalPages range when ≤ 7 pages', () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('rows', 1);
    const pages = component._pageNumbers();
    expect(pages.length).toBe(ITEMS.length);
    expect(pages[0]).toBe(1);
    expect(pages[ITEMS.length - 1]).toBe(ITEMS.length);
  });

  it('_pageNumbers includes ellipsis for many pages', () => {
    const manyItems = Array.from({ length: 30 }, (_, i) => ({ id: i }));
    fixture.componentRef.setInput('items', manyItems);
    fixture.componentRef.setInput('rows', 1);
    component._currentPage.set(15);
    const pages = component._pageNumbers();
    expect(pages).toContain('...');
  });
});
