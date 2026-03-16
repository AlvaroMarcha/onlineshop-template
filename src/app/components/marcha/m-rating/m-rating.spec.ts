import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MRating } from './m-rating';

describe('MRating', () => {
  let fixture: ComponentFixture<MRating>;
  let component: MRating;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MRating],
    }).compileComponents();

    fixture = TestBed.createComponent(MRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── value input (standalone binding) ─────────────────────────────

  it('should initialize _value from value input', () => {
    fixture.componentRef.setInput('value', 4);
    expect(component._value()).toBe(4);
  });

  // ── cssClass ─────────────────────────────────────────────────────

  it('should include base class and default size', () => {
    expect(component.cssClass()).toBe('m-rating m-rating--md');
  });

  it('should reflect size in cssClass', () => {
    fixture.componentRef.setInput('size', 'lg');
    expect(component.cssClass()).toContain('m-rating--lg');
  });

  it('should add is-readonly when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    expect(component.cssClass()).toContain('is-readonly');
  });

  it('should add is-disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    expect(component.cssClass()).toContain('is-disabled');
  });

  it('should add is-disabled via setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.cssClass()).toContain('is-disabled');
  });

  // ── _stars ────────────────────────────────────────────────────────

  it('should generate 5 stars by default', () => {
    expect(component._stars()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should generate stars matching max input', () => {
    fixture.componentRef.setInput('max', 3);
    expect(component._stars()).toEqual([1, 2, 3]);
  });

  // ── _isInteractive ────────────────────────────────────────────────

  it('should be interactive by default', () => {
    expect(component._isInteractive()).toBeTrue();
  });

  it('should not be interactive when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    expect(component._isInteractive()).toBeFalse();
  });

  it('should not be interactive when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    expect(component._isInteractive()).toBeFalse();
  });

  // ── onSelect ─────────────────────────────────────────────────────

  it('should set _value on select', () => {
    component.onSelect(3);
    expect(component._value()).toBe(3);
  });

  it('should toggle to 0 when clicking the active star again', () => {
    component._value.set(3);
    component.onSelect(3);
    expect(component._value()).toBe(0);
  });

  it('should emit ratingChange on select', () => {
    let emitted: number | undefined;
    component.ratingChange.subscribe(v => (emitted = v));
    component.onSelect(4);
    expect(emitted).toBe(4);
  });

  it('should emit 0 when deselecting', () => {
    component._value.set(3);
    let emitted: number | undefined;
    component.ratingChange.subscribe(v => (emitted = v));
    component.onSelect(3);
    expect(emitted).toBe(0);
  });

  it('should not select when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    component.onSelect(3);
    expect(component._value()).toBe(0);
  });

  it('should not select when disabled input true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.onSelect(3);
    expect(component._value()).toBe(0);
  });

  it('should not select when disabled via setDisabledState', () => {
    component.setDisabledState(true);
    component.onSelect(3);
    expect(component._value()).toBe(0);
  });

  // ── onHover / onLeave ─────────────────────────────────────────────

  it('should set _hovered on hover', () => {
    component.onHover(2);
    expect(component._hovered()).toBe(2);
  });

  it('should reset _hovered on leave', () => {
    component._hovered.set(3);
    component.onLeave();
    expect(component._hovered()).toBe(0);
  });

  it('should not hover when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    component.onHover(4);
    expect(component._hovered()).toBe(0);
  });

  // ── isFilled ─────────────────────────────────────────────────────

  it('should return true for stars up to _value', () => {
    component._value.set(3);
    expect(component.isFilled(1)).toBeTrue();
    expect(component.isFilled(3)).toBeTrue();
    expect(component.isFilled(4)).toBeFalse();
  });

  it('should return false for all stars when _value is 0', () => {
    expect(component.isFilled(1)).toBeFalse();
  });

  it('should use _hovered value when hovering (overrides _value)', () => {
    component._value.set(2);
    component._hovered.set(4);
    expect(component.isFilled(4)).toBeTrue();
    expect(component.isFilled(5)).toBeFalse();
  });

  // ── CVA ──────────────────────────────────────────────────────────

  it('should update _value via writeValue', () => {
    component.writeValue(4);
    expect(component._value()).toBe(4);
  });

  it('should handle writeValue(null) as 0', () => {
    component.writeValue(null);
    expect(component._value()).toBe(0);
  });

  it('should call onChange when selecting', () => {
    let changed: number | undefined;
    component.registerOnChange(v => (changed = v));
    component.onSelect(3);
    expect(changed).toBe(3);
  });

  it('should call onTouched when selecting', () => {
    let touched = false;
    component.registerOnTouched(() => (touched = true));
    component.onSelect(2);
    expect(touched).toBeTrue();
  });

  it('should update _isDisabled via setDisabledState', () => {
    component.setDisabledState(true);
    expect(component._isDisabled()).toBeTrue();
    component.setDisabledState(false);
    expect(component._isDisabled()).toBeFalse();
  });
});
