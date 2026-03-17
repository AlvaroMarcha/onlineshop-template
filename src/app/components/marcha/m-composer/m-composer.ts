import {
  Component, ChangeDetectionStrategy, input, output, signal, computed, model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { MButton } from '../m-button/m-button';
import { MDialog } from '../m-dialog/m-dialog';
import { MFileUpload } from '../m-file-upload/m-file-upload';
import { MRating } from '../m-rating/m-rating';
import { MFileUploadValidationError } from '../m-file-upload/m-file-upload';

export type MComposerMode = 'inline' | 'dialog';

export interface MComposerSubmit {
  text: string;
  rating?: number;
  attachments?: File[];
}

@Component({
  selector: 'm-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgTemplateOutlet, MButton, MDialog, MFileUpload, MRating],
  templateUrl: './m-composer.html',
  styleUrl: './m-composer.css',
})
export class MComposer {
  // ── Inputs ──────────────────────────────────────────────────────
  /** Modo de renderizado: inline en la página o dentro de un m-dialog. */
  readonly mode          = input<MComposerMode>('inline');
  /** Título del dialog (solo en mode="dialog"). */
  readonly dialogHeader  = input<string>('');
  /** Placeholder del textarea. */
  readonly placeholder   = input<string>('Escribe algo...');
  /** Muestra el selector de rating (estrellas). */
  readonly withRating    = input<boolean>(false);
  /** Muestra el selector de imagen adjunta. */
  readonly withAttachment = input<boolean>(false);
  /** Longitud mínima del texto para habilitar envío. */
  readonly minLength     = input<number>(1);
  /** Longitud máxima del texto (0 = sin límite). */
  readonly maxLength     = input<number>(0);
  /** Texto inicial para prellenar el textarea (modo edición). */
  readonly initialText   = input<string>('');
  /** Rating inicial para prellenar las estrellas (modo edición). */
  readonly initialRating = input<number>(0);
  /** Cuando es true, el texto es opcional y basta con el rating para enviar. */
  readonly textOptional  = input<boolean>(false);
  /** Etiqueta del botón de envío. */
  readonly submitLabel   = input<string>('Enviar');
  /** Muestra el botón de cancelar. */
  readonly showCancel    = input<boolean>(true);
  /** Etiqueta del botón de cancelar. */
  readonly cancelLabel   = input<string>('Cancelar');
  /** Deshabilita el formulario completo. */
  readonly disabled      = input<boolean>(false);
  /** Muestra el spinner de carga durante el envío. */
  readonly loading       = input<boolean>(false);

  // ── Modelo bidireccional para control del dialog desde fuera ────
  /** Controla la visibilidad cuando mode="dialog". */
  readonly open = model<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────
  readonly submitted  = output<MComposerSubmit>();
  readonly cancelled  = output<void>();

  // ── State interno ────────────────────────────────────────────────
  readonly _text        = signal<string>('');
  readonly _rating      = signal<number>(0);
  readonly _attachments = signal<File[]>([]);
  readonly _uploading   = signal<boolean>(false);

  readonly _charCount = computed(() => this._text().length);

  ngOnInit(): void {
    if (this.initialText())   this._text.set(this.initialText());
    if (this.initialRating()) this._rating.set(this.initialRating());
  }

  readonly _canSubmit = computed(() => {
    if (this.disabled() || this.loading()) return false;
    const trimmed = this._text().trim();
    if (this.maxLength() > 0 && trimmed.length > this.maxLength()) return false;
    if (this.withRating() && this._rating() === 0) return false;
    // Si el texto es opcional y hay rating, no se exige longitud mínima
    if (this.textOptional() && this.withRating() && this._rating() > 0) return true;
    if (trimmed.length < this.minLength()) return false;
    return true;
  });

  readonly _isOverLimit = computed(() =>
    this.maxLength() > 0 && this._charCount() > this.maxLength()
  );

  // ── Handlers ─────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this._canSubmit()) return;
    const payload: MComposerSubmit = {
      text: this._text().trim(),
      ...(this.withRating()      && { rating: this._rating() }),
      ...(this.withAttachment()  && { attachments: this._attachments() }),
    };
    this.submitted.emit(payload);
    this._reset();
    if (this.mode() === 'dialog') this.open.set(false);
  }

  onCancel(): void {
    this._reset();
    this.cancelled.emit();
    if (this.mode() === 'dialog') this.open.set(false);
  }

  onFileAdded(file: File): void {
    this._attachments.update(prev => [...prev, file]);
    this._uploading.set(false);
  }

  onFileError(_err: MFileUploadValidationError): void {
    this._uploading.set(false);
  }

  removeAttachment(index: number): void {
    this._attachments.update(prev => prev.filter((_, i) => i !== index));
  }

  // ── Private ──────────────────────────────────────────────────────

  private _reset(): void {
    this._text.set('');
    this._rating.set(0);
    this._attachments.set([]);
    this._uploading.set(false);
  }
}
