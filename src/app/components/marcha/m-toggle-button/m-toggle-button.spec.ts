import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MToggleButton } from './m-toggle-button';

describe('MToggleButton', () => {
  let fixture: ComponentFixture<MToggleButton>;
  let component: MToggleButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MToggleButton] }).compileComponents();
    fixture = TestBed.createComponent(MToggleButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should start inactive', () => expect(component.active()).toBeFalse());

  it('writeValue(true) sets active to true', () => {
    component.writeValue(true);
    expect(component.active()).toBeTrue();
  });

  it('writeValue(false) sets active to false', () => {
    component.writeValue(true);
    component.writeValue(false);
    expect(component.active()).toBeFalse();
  });

  it('writeValue(null) sets active to false', () => {
    component.writeValue(null);
    expect(component.active()).toBeFalse();
  });

  it('onToggle flips active state', () => {
    component.onToggle();
    expect(component.active()).toBeTrue();
    component.onToggle();
    expect(component.active()).toBeFalse();
  });

  it('onToggle calls onChange with new value', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.onToggle();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('onToggle calls onTouched', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    component.onToggle();
    expect(spy).toHaveBeenCalled();
  });

  it('does not toggle when disabled', () => {
    component.setDisabledState(true);
    component.onToggle();
    expect(component.active()).toBeFalse();
  });

  it('setDisabledState updates isDisabled signal', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBeTrue();
    component.setDisabledState(false);
    expect(component.isDisabled()).toBeFalse();
  });

  it('cssClass includes size and severity', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('severity', 'success');
    expect(component.cssClass()).toContain('size-lg');
    expect(component.cssClass()).toContain('sev-success');
  });

  it('cssClass includes is-active when active', () => {
    component.writeValue(true);
    expect(component.cssClass()).toContain('is-active');
  });
});
