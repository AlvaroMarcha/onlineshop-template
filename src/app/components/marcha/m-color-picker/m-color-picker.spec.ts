import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MColorPicker } from './m-color-picker';

describe('MColorPicker', () => {
  let fixture: ComponentFixture<MColorPicker>;
  let component: MColorPicker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MColorPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(MColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute a valid hex color by default', () => {
    expect(component.hexColor()).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('writeValue should update internal HSV and hexInput', () => {
    component.writeValue('#ff0000');
    expect(component.hexColor().toLowerCase()).toBe('#ff0000');
    expect(component.hexInput().toLowerCase()).toBe('#ff0000');
  });

  it('writeValue with null should not crash', () => {
    expect(() => component.writeValue(null)).not.toThrow();
  });

  it('writeValue with invalid hex should not crash', () => {
    expect(() => component.writeValue('#xyz')).not.toThrow();
  });

  it('toggle should open the panel', () => {
    expect(component.isOpen()).toBeFalse();
    component.toggle();
    expect(component.isOpen()).toBeTrue();
  });

  it('toggle should close the panel when already open', () => {
    component.toggle();
    component.toggle();
    expect(component.isOpen()).toBeFalse();
  });

  it('should not toggle when disabled', () => {
    component.setDisabledState(true);
    component.toggle();
    expect(component.isOpen()).toBeFalse();
  });

  it('close is idempotent when already closed', () => {
    expect(() => component.isOpen.set(false)).not.toThrow();
  });

  it('pickSwatch should update the color and call onChange', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.pickSwatch('#22c55e');
    expect(spy).toHaveBeenCalledWith(jasmine.stringMatching(/^#[0-9a-f]{6}$/i));
  });

  it('isActiveSwatch should return true when swatch matches current color', () => {
    component.writeValue('#ef4444');
    const active = component.isActiveSwatch('#ef4444');
    expect(active).toBeTrue();
  });

  it('isActiveSwatch should return false for non-active swatch', () => {
    component.writeValue('#ef4444');
    expect(component.isActiveSwatch('#3b82f6')).toBeFalse();
  });

  it('applyHexInput with valid hex should emit the new color', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.hexInput.set('#00ff00');
    component.applyHexInput();
    expect(spy).toHaveBeenCalled();
    expect(component.hexColor().toLowerCase()).toBe('#00ff00');
  });

  it('applyHexInput with invalid hex should reset to current color', () => {
    component.writeValue('#3b82f6');
    component.hexInput.set('notacolor');
    component.applyHexInput();
    expect(component.hexInput()).toBe(component.hexColor());
  });

  it('applyHexInput should accept hex without # prefix', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.hexInput.set('ff6600');
    component.applyHexInput();
    expect(spy).toHaveBeenCalled();
  });

  it('hueBg should return a valid hsl string', () => {
    expect(component.hueBg()).toMatch(/^hsl\(\d+, 100%, 50%\)$/);
  });

  it('setDisabledState should update isDisabled signal', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBeTrue();
    component.setDisabledState(false);
    expect(component.isDisabled()).toBeFalse();
  });

  it('registerOnTouched should store the callback', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    component.toggle(); // triggers _onTouched
    expect(spy).toHaveBeenCalled();
  });
});
