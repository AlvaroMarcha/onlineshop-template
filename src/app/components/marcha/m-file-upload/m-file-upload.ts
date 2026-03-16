import {
  Component, ChangeDetectionStrategy, input, output, signal, computed,
  viewChild, ElementRef, OnDestroy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MFileUploadValidationError = 'invalid_type' | 'too_large';

@Component({
  selector: 'm-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-file-upload.html',
  styleUrl: './m-file-upload.css',
})
export class MFileUpload implements OnDestroy {
  // ── Inputs ──────────────────────────────────────────────────────
  /** Tipos MIME aceptados, separados por coma. Ej: 'image/jpeg,image/png' */
  readonly accept    = input<string>('image/jpeg,image/jpg,image/png');
  /** Tamaño máximo permitido en MB. */
  readonly maxSizeMb = input<number>(5);
  /** Estado de subida externo — muestra spinner en el overlay. */
  readonly uploading = input<boolean>(false);
  /** Deshabilita clics y drag-drop. */
  readonly disabled  = input<boolean>(false);
  /** Etiqueta accesible para el botón de subida. */
  readonly ariaLabel = input<string>('');

  // ── Outputs ─────────────────────────────────────────────────────
  /** Emite el `File` seleccionado (ya validado por tipo y tamaño). */
  readonly fileChange      = output<File>();
  /** Emite cuando el archivo no pasa la validación interna. */
  readonly validationError = output<MFileUploadValidationError>();

  // ── Internal state ───────────────────────────────────────────────
  readonly _fileInput  = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  readonly _isDragging = signal(false);
  readonly _picking    = signal(false);
  private  _focusCleanup: (() => void) | null = null;

  readonly hostClass = computed(() =>
    'm-file-upload' +
    (this._isDragging()                     ? ' is-dragging'  : '') +
    (this.uploading() || this._picking()    ? ' is-uploading' : '') +
    (this.disabled()                        ? ' is-disabled'  : '')
  );

  // ── Public handlers ──────────────────────────────────────────────

  triggerPick(): void {
    if (this.disabled() || this.uploading() || this._picking()) return;
    this._picking.set(true);
    this._fileInput()?.nativeElement.click();
    // Pequeño delay para evitar falsos positivos del foco: el OS abre el diálogo
    // y cuando se cierra (selección o cancelar), window recupera el foco.
    setTimeout(() => {
      const handler = () => this._stopPicking();
      this._focusCleanup = () => window.removeEventListener('focus', handler);
      window.addEventListener('focus', handler, { once: true });
    }, 300);
  }

  onFileInputChange(event: Event): void {
    this._stopPicking();
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this._processFile(input.files[0]);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled() && !this.uploading()) this._isDragging.set(true);
  }

  onDragLeave(): void { this._isDragging.set(false); }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this._isDragging.set(false);
    if (this.disabled() || this.uploading()) return;
    const file = event.dataTransfer?.files[0];
    if (file) this._processFile(file);
  }

  // ── Private ──────────────────────────────────────────────────────

  private _stopPicking(): void {
    this._picking.set(false);
    this._focusCleanup?.();
    this._focusCleanup = null;
  }

  ngOnDestroy(): void {
    this._focusCleanup?.();
  }

  private _processFile(file: File): void {
    if (!this._isTypeAccepted(file.type)) {
      this.validationError.emit('invalid_type');
      return;
    }
    if (file.size > this.maxSizeMb() * 1024 * 1024) {
      this.validationError.emit('too_large');
      return;
    }
    this.fileChange.emit(file);
  }

  private _isTypeAccepted(fileType: string): boolean {
    return this.accept().split(',').some(accepted => {
      const t = accepted.trim();
      return t.endsWith('/*')
        ? fileType.startsWith(t.slice(0, -1))
        : fileType === t;
    });
  }
}
