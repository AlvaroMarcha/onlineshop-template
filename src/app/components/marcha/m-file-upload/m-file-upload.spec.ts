import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MFileUpload, MFileUploadValidationError } from './m-file-upload';

const JPEG_FILE  = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
const PNG_FILE   = new File(['img'], 'photo.png', { type: 'image/png' });
const GIF_FILE   = new File(['img'], 'anim.gif',  { type: 'image/gif' });
const LARGE_FILE = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });

describe('MFileUpload', () => {
  let fixture: ComponentFixture<MFileUpload>;
  let component: MFileUpload;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MFileUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(MFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── hostClass ────────────────────────────────────────────────────

  it('should have base class m-file-upload', () => {
    expect(component.hostClass()).toBe('m-file-upload');
  });

  it('should add is-dragging class while dragging', () => {
    component._isDragging.set(true);
    expect(component.hostClass()).toContain('is-dragging');
  });

  it('should add is-uploading class when uploading', () => {
    fixture.componentRef.setInput('uploading', true);
    expect(component.hostClass()).toContain('is-uploading');
  });

  it('should add is-disabled class when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    expect(component.hostClass()).toContain('is-disabled');
  });

  // ── Drag state ───────────────────────────────────────────────────

  it('should set _isDragging to true on dragover when not disabled', () => {
    const event = new DragEvent('dragover');
    spyOn(event, 'preventDefault');
    component.onDragOver(event);
    expect(component._isDragging()).toBeTrue();
  });

  it('should not set _isDragging when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const event = new DragEvent('dragover');
    spyOn(event, 'preventDefault');
    component.onDragOver(event);
    expect(component._isDragging()).toBeFalse();
  });

  it('should clear _isDragging on dragleave', () => {
    component._isDragging.set(true);
    component.onDragLeave();
    expect(component._isDragging()).toBeFalse();
  });

  // ── triggerPick ──────────────────────────────────────────────────

  it('should not call click when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const inputSpy = jasmine.createSpyObj('input', ['click']);
    spyOn(component._fileInput()!.nativeElement, 'click');
    component.triggerPick();
    expect(component._fileInput()!.nativeElement.click).not.toHaveBeenCalled();
  });

  // ── File validation (via _processFile) ───────────────────────────

  it('should emit fileChange for a valid jpeg file', () => {
    let received: File | undefined;
    component.fileChange.subscribe(f => (received = f));
    (component as any)['_processFile'](JPEG_FILE);
    expect(received).toBe(JPEG_FILE);
  });

  it('should emit fileChange for a valid png file', () => {
    let received: File | undefined;
    component.fileChange.subscribe(f => (received = f));
    (component as any)['_processFile'](PNG_FILE);
    expect(received).toBe(PNG_FILE);
  });

  it('should emit validationError invalid_type for unsupported format', () => {
    let error: MFileUploadValidationError | undefined;
    component.validationError.subscribe(e => (error = e));
    (component as any)['_processFile'](GIF_FILE);
    expect(error).toBe('invalid_type');
  });

  it('should emit validationError too_large when file exceeds maxSizeMb', () => {
    let error: MFileUploadValidationError | undefined;
    component.validationError.subscribe(e => (error = e));
    (component as any)['_processFile'](LARGE_FILE);
    expect(error).toBe('too_large');
  });

  it('should not emit fileChange on invalid type', () => {
    let called = false;
    component.fileChange.subscribe(() => (called = true));
    (component as any)['_processFile'](GIF_FILE);
    expect(called).toBeFalse();
  });

  // ── accept wildcard ──────────────────────────────────────────────

  it('should accept files matching a wildcard accept', () => {
    fixture.componentRef.setInput('accept', 'image/*');
    fixture.detectChanges();
    let received: File | undefined;
    component.fileChange.subscribe(f => (received = f));
    (component as any)['_processFile'](PNG_FILE);
    expect(received).toBe(PNG_FILE);
  });

  // ── onDrop ───────────────────────────────────────────────────────

  it('should clear _isDragging on drop', () => {
    component._isDragging.set(true);
    const dt = new DataTransfer();
    dt.items.add(JPEG_FILE);
    const event = new DragEvent('drop', { dataTransfer: dt });
    spyOn(event, 'preventDefault');
    component.onDrop(event);
    expect(component._isDragging()).toBeFalse();
  });

  it('should not emit anything on drop when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let called = false;
    component.fileChange.subscribe(() => (called = true));
    const dt = new DataTransfer();
    dt.items.add(JPEG_FILE);
    const event = new DragEvent('drop', { dataTransfer: dt });
    spyOn(event, 'preventDefault');
    component.onDrop(event);
    expect(called).toBeFalse();
  });

  // ── onFileInputChange ─────────────────────────────────────────────

  it('should emit fileChange via onFileInputChange with valid file', () => {
    let received: File | undefined;
    component.fileChange.subscribe(f => (received = f));
    const dt = new DataTransfer();
    dt.items.add(JPEG_FILE);
    const fakeEvent = { target: { files: dt.files, value: '' } } as unknown as Event;
    component.onFileInputChange(fakeEvent);
    expect(received).toBe(JPEG_FILE);
  });
});
