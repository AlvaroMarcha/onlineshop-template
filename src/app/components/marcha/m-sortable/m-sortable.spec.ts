import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MSortable, MSortableItem } from './m-sortable';

const ITEMS: MSortableItem[] = [
  { id: 1, label: 'Alpha' },
  { id: 2, label: 'Beta' },
  { id: 3, label: 'Gamma' },
];

describe('MSortable', () => {
  let fixture: ComponentFixture<MSortable>;
  let component: MSortable;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MSortable],
    }).compileComponents();

    fixture = TestBed.createComponent(MSortable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no drag state', () => {
    expect(component._dragIndex()).toBeNull();
    expect(component._overIndex()).toBeNull();
  });

  it('isDragging returns true only for active drag index', () => {
    component.onDragStart(new DragEvent('dragstart'), 1);
    expect(component.isDragging(1)).toBeTrue();
    expect(component.isDragging(0)).toBeFalse();
  });

  it('isDragOver returns true only for hovered non-dragging index', () => {
    component.onDragStart(new DragEvent('dragstart'), 0);
    component.onDragOver(new DragEvent('dragover'), 2);
    expect(component.isDragOver(2)).toBeTrue();
    expect(component.isDragOver(0)).toBeFalse(); // dragging item excluded
  });

  it('onDragEnd should reset drag state', () => {
    component.onDragStart(new DragEvent('dragstart'), 0);
    component.onDragEnd();
    expect(component._dragIndex()).toBeNull();
    expect(component._overIndex()).toBeNull();
  });

  it('onDragLeave should clear over index', () => {
    component.onDragOver(new DragEvent('dragover'), 1);
    component.onDragLeave();
    expect(component._overIndex()).toBeNull();
  });

  it('onDrop should emit reordered array', () => {
    const spy = jasmine.createSpy('orderChange');
    component.orderChange.subscribe(spy);

    component.onDragStart(new DragEvent('dragstart'), 0);
    component.onDrop(new DragEvent('drop'), 2);

    expect(spy).toHaveBeenCalledWith([
      { id: 2, label: 'Beta' },
      { id: 3, label: 'Gamma' },
      { id: 1, label: 'Alpha' },
    ]);
  });

  it('onDrop on same index should not emit', () => {
    const spy = jasmine.createSpy('orderChange');
    component.orderChange.subscribe(spy);

    component.onDragStart(new DragEvent('dragstart'), 1);
    component.onDrop(new DragEvent('drop'), 1);

    expect(spy).not.toHaveBeenCalled();
  });

  it('onDrop should reset drag state', () => {
    component.onDragStart(new DragEvent('dragstart'), 0);
    component.onDrop(new DragEvent('drop'), 1);
    expect(component._dragIndex()).toBeNull();
    expect(component._overIndex()).toBeNull();
  });
});
