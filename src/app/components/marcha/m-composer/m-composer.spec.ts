import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MComposer, MComposerSubmit } from './m-composer';

describe('MComposer', () => {
  let fixture: ComponentFixture<MComposer>;
  let component: MComposer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MComposer],
    }).compileComponents();

    fixture = TestBed.createComponent(MComposer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── _canSubmit ────────────────────────────────────────────────────

  it('should not be submittable when text is empty', () => {
    expect(component._canSubmit()).toBeFalse();
  });

  it('should be submittable with at least 1 character', () => {
    component._text.set('hola');
    expect(component._canSubmit()).toBeTrue();
  });

  it('should not be submittable when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    component._text.set('hola');
    expect(component._canSubmit()).toBeFalse();
  });

  it('should not be submittable when loading', () => {
    fixture.componentRef.setInput('loading', true);
    component._text.set('hola');
    expect(component._canSubmit()).toBeFalse();
  });

  it('should not be submittable when text is below minLength', () => {
    fixture.componentRef.setInput('minLength', 10);
    component._text.set('corto');
    expect(component._canSubmit()).toBeFalse();
  });

  it('should not be submittable when over maxLength', () => {
    fixture.componentRef.setInput('maxLength', 5);
    component._text.set('demasiadolargo');
    expect(component._canSubmit()).toBeFalse();
  });

  it('should not be submittable when withRating is true and rating is 0', () => {
    fixture.componentRef.setInput('withRating', true);
    component._text.set('buen producto');
    expect(component._canSubmit()).toBeFalse();
  });

  it('should be submittable when withRating is true and rating > 0', () => {
    fixture.componentRef.setInput('withRating', true);
    component._text.set('buen producto');
    component._rating.set(4);
    expect(component._canSubmit()).toBeTrue();
  });

  // ── _isOverLimit ─────────────────────────────────────────────────

  it('should not be over limit when maxLength is 0', () => {
    component._text.set('texto largo sin limite');
    expect(component._isOverLimit()).toBeFalse();
  });

  it('should be over limit when maxLength is set and exceeded', () => {
    fixture.componentRef.setInput('maxLength', 5);
    component._text.set('excedido!!');
    expect(component._isOverLimit()).toBeTrue();
  });

  // ── _charCount ────────────────────────────────────────────────────

  it('should count characters correctly', () => {
    component._text.set('hola!');
    expect(component._charCount()).toBe(5);
  });

  // ── onSubmit ─────────────────────────────────────────────────────

  it('should emit submitted with text on submit', () => {
    let result: MComposerSubmit | undefined;
    component.submitted.subscribe(v => (result = v));
    component._text.set('  mi texto  ');
    component.onSubmit();
    expect(result?.text).toBe('mi texto');
  });

  it('should include rating in payload when withRating is true', () => {
    fixture.componentRef.setInput('withRating', true);
    component._text.set('buen producto');
    component._rating.set(5);
    let result: MComposerSubmit | undefined;
    component.submitted.subscribe(v => (result = v));
    component.onSubmit();
    expect(result?.rating).toBe(5);
  });

  it('should not include rating in payload when withRating is false', () => {
    component._text.set('hola');
    let result: MComposerSubmit | undefined;
    component.submitted.subscribe(v => (result = v));
    component.onSubmit();
    expect(result?.rating).toBeUndefined();
  });

  it('should reset state after submit', () => {
    component._text.set('contenido');
    component._rating.set(3);
    component.onSubmit();
    expect(component._text()).toBe('');
    expect(component._rating()).toBe(0);
  });

  it('should not emit when _canSubmit is false', () => {
    let called = false;
    component.submitted.subscribe(() => (called = true));
    component.onSubmit(); // texto vacío
    expect(called).toBeFalse();
  });

  // ── onCancel ─────────────────────────────────────────────────────

  it('should emit cancelled on cancel', () => {
    let called = false;
    component.cancelled.subscribe(() => (called = true));
    component.onCancel();
    expect(called).toBeTrue();
  });

  it('should reset state on cancel', () => {
    component._text.set('borrar');
    component._rating.set(2);
    component.onCancel();
    expect(component._text()).toBe('');
    expect(component._rating()).toBe(0);
  });

  // ── attachments ──────────────────────────────────────────────────

  it('should add file to attachments on onFileAdded', () => {
    const file = new File(['data'], 'img.jpg', { type: 'image/jpeg' });
    component.onFileAdded(file);
    expect(component._attachments()).toContain(file);
  });

  it('should remove attachment by index', () => {
    const f1 = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const f2 = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
    component._attachments.set([f1, f2]);
    component.removeAttachment(0);
    expect(component._attachments()).toEqual([f2]);
  });

  it('should clear uploading state on file error', () => {
    component._uploading.set(true);
    component.onFileError('invalid_type');
    expect(component._uploading()).toBeFalse();
  });

  // ── mode ─────────────────────────────────────────────────────────

  it('should default to inline mode', () => {
    expect(component.mode()).toBe('inline');
  });
});
