import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MCopy } from './m-copy';

describe('MCopy', () => {
  let fixture: ComponentFixture<MCopy>;
  let component: MCopy;

  beforeEach(async () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [MCopy],
    }).compileComponents();

    fixture = TestBed.createComponent(MCopy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with copied = false and error = false', () => {
    expect(component.copied()).toBeFalse();
    expect(component.error()).toBeFalse();
  });

  it('copy() should set copied to true on success', async () => {
    await component.copy();
    expect(component.copied()).toBeTrue();
  });

  it('copy() should call clipboard.writeText with input text', async () => {
    fixture.componentRef.setInput('text', 'hello world');
    await component.copy();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
  });

  it('copy() should reset copied after duration', fakeAsync(async () => {
    fixture.componentRef.setInput('duration', 500);
    await component.copy();
    expect(component.copied()).toBeTrue();
    tick(500);
    expect(component.copied()).toBeFalse();
  }));

  it('copy() while already copied should be a no-op', async () => {
    await component.copy();
    (navigator.clipboard.writeText as jasmine.Spy).calls.reset();
    await component.copy();
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('copy() should set error on clipboard failure', async () => {
    (navigator.clipboard.writeText as jasmine.Spy).and.returnValue(Promise.reject(new Error('denied')));
    await component.copy();
    expect(component.error()).toBeTrue();
    expect(component.copied()).toBeFalse();
  });

  it('should default variant to "default"', () => {
    expect(component.variant()).toBe('default');
  });
});
