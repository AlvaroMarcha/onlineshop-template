import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MToggleSwitch } from './m-toggle-switch';

describe('MToggleSwitch', () => {
  let fixture: ComponentFixture<MToggleSwitch>;
  let component: MToggleSwitch;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MToggleSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(MToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start unchecked', () => {
    expect(component.checked()).toBeFalse();
  });

  it('writeValue(true) should set checked to true', () => {
    component.writeValue(true);
    expect(component.checked()).toBeTrue();
  });

  it('writeValue(false) should set checked to false', () => {
    component.writeValue(true);
    component.writeValue(false);
    expect(component.checked()).toBeFalse();
  });

  it('writeValue(null) should set checked to false', () => {
    component.writeValue(null);
    expect(component.checked()).toBeFalse();
  });

  it('onToggle should flip checked state', () => {
    component.onToggle();
    expect(component.checked()).toBeTrue();
    component.onToggle();
    expect(component.checked()).toBeFalse();
  });

  it('onToggle should call onChange with new value', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.onToggle();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('onToggle should call onTouched', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    component.onToggle();
    expect(spy).toHaveBeenCalled();
  });

  it('should not toggle when disabled', () => {
    component.setDisabledState(true);
    component.onToggle();
    expect(component.checked()).toBeFalse();
  });

  it('setDisabledState should update isDisabled signal', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBeTrue();
    component.setDisabledState(false);
    expect(component.isDisabled()).toBeFalse();
  });
});
