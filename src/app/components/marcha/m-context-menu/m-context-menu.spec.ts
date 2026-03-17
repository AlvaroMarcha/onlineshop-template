import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MContextMenu, MContextMenuItem } from './m-context-menu';
import { MContextMenuService } from './m-context-menu.service';
import { MContextMenuDirective } from './m-context-menu.directive';

const SAMPLE_ITEMS: MContextMenuItem[] = [
  { id: 'edit',   label: 'Editar',   icon: 'lucide:pencil' },
  { id: 'dup',    label: 'Duplicar', icon: 'lucide:copy' },
  { id: 'sep',    divider: true },
  { id: 'delete', label: 'Eliminar', icon: 'lucide:trash-2', severity: 'danger' },
];

// ─── MContextMenuService ────────────────────────────────────────────

describe('MContextMenuService', () => {
  let service: MContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MContextMenuService);
  });

  afterEach(() => service.close());

  it('should be created', () => expect(service).toBeTruthy());

  it('open() appends panel to body', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose: () => {},
    });

    expect(document.querySelector('.m-ctx')).not.toBeNull();
    document.body.removeChild(anchor);
  });

  it('close() removes panel from body', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose: () => {},
    });
    service.close();

    expect(document.querySelector('.m-ctx')).toBeNull();
    document.body.removeChild(anchor);
  });

  it('close() calls onClose callback', () => {
    const anchor   = document.createElement('div');
    const onClose  = jasmine.createSpy('onClose');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose,
    });
    service.close(onClose);

    expect(onClose).toHaveBeenCalled();
    document.body.removeChild(anchor);
  });

  it('open() with variant "mini" adds m-ctx--mini class', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'mini', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose: () => {},
    });

    expect(document.querySelector('.m-ctx--mini')).not.toBeNull();
    document.body.removeChild(anchor);
  });

  it('open() with variant "grid" adds m-ctx--grid class', () => {
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'grid', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose: () => {},
    });

    expect(document.querySelector('.m-ctx--grid')).not.toBeNull();
    document.body.removeChild(anchor);
  });

  it('onSelect callback fires when item button clicked', () => {
    const anchor   = document.createElement('div');
    const onSelect = jasmine.createSpy('onSelect');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect, onClose: () => {},
    });

    const btn = document.querySelector<HTMLButtonElement>('.m-ctx__item[data-item-id="edit"]');
    btn?.click();

    expect(onSelect).toHaveBeenCalledWith(jasmine.objectContaining({ id: 'edit' }));
    document.body.removeChild(anchor);
  });

  it('disabled item does not fire onSelect', () => {
    const anchor   = document.createElement('div');
    const onSelect = jasmine.createSpy('onSelect');
    const items: MContextMenuItem[] = [
      { id: 'dis', label: 'Disabled', disabled: true },
    ];
    document.body.appendChild(anchor);

    service.open({
      items, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect, onClose: () => {},
    });

    const btn = document.querySelector<HTMLButtonElement>('.m-ctx__item');
    btn?.click();
    expect(onSelect).not.toHaveBeenCalled();
    document.body.removeChild(anchor);
  });

  it('pressing Escape closes the panel', () => {
    const anchor  = document.createElement('div');
    const onClose = jasmine.createSpy('onClose');
    document.body.appendChild(anchor);

    service.open({
      items: SAMPLE_ITEMS, variant: 'list', placement: 'auto',
      anchorEl: anchor, cursorX: 50, cursorY: 50,
      onSelect: () => {}, onClose,
    });

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);

    expect(document.querySelector('.m-ctx')).toBeNull();
    document.body.removeChild(anchor);
  });
});

// ─── MContextMenu Component ──────────────────────────────────────────

describe('MContextMenu', () => {
  let fixture: ComponentFixture<MContextMenu>;
  let component: MContextMenu;
  let service: MContextMenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MContextMenu] }).compileComponents();
    fixture   = TestBed.createComponent(MContextMenu);
    component = fixture.componentInstance;
    service   = TestBed.inject(MContextMenuService);
    fixture.componentRef.setInput('items', SAMPLE_ITEMS);
    fixture.detectChanges();
  });

  afterEach(() => service.close());

  it('should create', () => expect(component).toBeTruthy());

  it('defaults: variant=list, trigger=click, placement=auto, visible=false', () => {
    expect(component.variant()).toBe('list');
    expect(component.trigger()).toBe('click');
    expect(component.placement()).toBe('auto');
    expect(component.visible()).toBeFalse();
  });

  it('click trigger opens the panel via service', () => {
    const openSpy = spyOn(service, 'open');
    fixture.nativeElement.click();
    expect(openSpy).toHaveBeenCalled();
  });

  it('contextmenu trigger opens on right-click', () => {
    fixture.componentRef.setInput('trigger', 'contextmenu');
    fixture.detectChanges();
    const openSpy = spyOn(service, 'open');
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fixture.nativeElement.dispatchEvent(event);
    expect(openSpy).toHaveBeenCalled();
  });

  it('click does NOT open if trigger=contextmenu', () => {
    fixture.componentRef.setInput('trigger', 'contextmenu');
    fixture.detectChanges();
    const openSpy = spyOn(service, 'open');
    fixture.nativeElement.click();
    expect(openSpy).not.toHaveBeenCalled();
  });
});

// ─── MContextMenuDirective ───────────────────────────────────────────

@Component({
  standalone: true,
  imports: [MContextMenuDirective],
  template: `<div [mContextMenu]="items"></div>`,
})
class DirectiveHostComponent {
  items: MContextMenuItem[] = [{ id: 'test', label: 'Test' }];
}

describe('MContextMenuDirective', () => {
  it('should create directive', async () => {
    await TestBed.configureTestingModule({ imports: [DirectiveHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });
});
