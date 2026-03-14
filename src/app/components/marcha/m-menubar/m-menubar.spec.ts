import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MMenubar, MMenubarItem } from './m-menubar';

const ITEMS: MMenubarItem[] = [
  {
    label: 'Archivo',
    items: [
      { label: 'Nuevo',   icon: 'lucide:file-plus' },
      { divider: true },
      { label: 'Guardar', disabled: true },
    ],
  },
  { label: 'Editar', items: [{ label: 'Cortar' }, { label: 'Copiar' }] },
  { label: 'Vista' },
  { label: 'Deshabilitado', disabled: true },
];

describe('MMenubar', () => {
  let fixture: ComponentFixture<MMenubar>;
  let component: MMenubar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MMenubar] }).compileComponents();
    fixture = TestBed.createComponent(MMenubar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('_openIndex starts null', () => expect(component._openIndex()).toBeNull());

  it('clicking item with sub opens dropdown', () => {
    component.onItemClick(0, ITEMS[0], new MouseEvent('click'));
    expect(component._openIndex()).toBe(0);
  });

  it('clicking the same open item closes dropdown', () => {
    component.onItemClick(0, ITEMS[0], new MouseEvent('click'));
    component.onItemClick(0, ITEMS[0], new MouseEvent('click'));
    expect(component._openIndex()).toBeNull();
  });

  it('clicking a different item changes open index', () => {
    component.onItemClick(0, ITEMS[0], new MouseEvent('click'));
    component.onItemClick(1, ITEMS[1], new MouseEvent('click'));
    expect(component._openIndex()).toBe(1);
  });

  it('clicking leaf item emits itemClick', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onItemClick(2, ITEMS[2], new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith(ITEMS[2]);
  });

  it('clicking leaf item keeps dropdown closed', () => {
    component.onItemClick(2, ITEMS[2], new MouseEvent('click'));
    expect(component._openIndex()).toBeNull();
  });

  it('clicking disabled item does not emit or open', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onItemClick(3, ITEMS[3], new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
    expect(component._openIndex()).toBeNull();
  });

  it('clicking sub item emits and closes dropdown', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onItemClick(0, ITEMS[0], new MouseEvent('click'));
    component.onSubClick(ITEMS[0].items![0], new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith(ITEMS[0].items![0]);
    expect(component._openIndex()).toBeNull();
  });

  it('clicking divider sub does not emit', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onSubClick(ITEMS[0].items![1], new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('clicking disabled sub does not emit', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onSubClick(ITEMS[0].items![2], new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  // ── Mobile panel ──

  it('_mobileOpen starts false', () => expect(component._mobileOpen()).toBeFalse());

  it('toggleMobile opens and then closes the mobile panel', () => {
    component.toggleMobile(new MouseEvent('click'));
    expect(component._mobileOpen()).toBeTrue();
    component.toggleMobile(new MouseEvent('click'));
    expect(component._mobileOpen()).toBeFalse();
  });

  it('toggleMobileItem with leaf item emits and closes mobile panel', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component._mobileOpen.set(true);
    component.toggleMobileItem(2, ITEMS[2], new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith(ITEMS[2]);
    expect(component._mobileOpen()).toBeFalse();
  });

  it('toggleMobileItem with sub-item expands accordion', () => {
    component._mobileOpen.set(true);
    component.toggleMobileItem(0, ITEMS[0], new MouseEvent('click'));
    expect(component._mobileExpand()).toBe(0);
  });

  it('toggleMobileItem same index collapses accordion', () => {
    component._mobileOpen.set(true);
    component.toggleMobileItem(0, ITEMS[0], new MouseEvent('click'));
    component.toggleMobileItem(0, ITEMS[0], new MouseEvent('click'));
    expect(component._mobileExpand()).toBeNull();
  });

  it('onMobileSubClick emits and closes mobile panel', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component._mobileOpen.set(true);
    component.onMobileSubClick(ITEMS[0].items![0], new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith(ITEMS[0].items![0]);
    expect(component._mobileOpen()).toBeFalse();
  });

  it('onDocClick with outside target closes open dropdown and mobile panel', () => {
    component._openIndex.set(0);
    component._mobileOpen.set(true);
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    component.onDocClick({ target: outside } as unknown as Event);
    expect(component._openIndex()).toBeNull();
    expect(component._mobileOpen()).toBeFalse();
    outside.remove();
  });
});
