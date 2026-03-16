import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ProductReviewsItem } from '../../type/types';
import { MComposer, MComposerSubmit } from '../marcha/m-composer/m-composer';
import { MRating } from '../marcha/m-rating/m-rating';
import { MAvatar } from '../marcha/m-avatar/m-avatar';
import { MButton } from '../marcha/m-button/m-button';
import { MIcon } from '../marcha/m-icon/m-icon';
import { MDivider } from '../marcha/m-divider/m-divider';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MComposer, MRating, MAvatar, MButton, MIcon, MDivider],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews {
  /** Reviews del producto (pasadas por el padre desde el estado del store). */
  readonly reviews    = input<ProductReviewsItem[]>([]);
  /** Username del usuario autenticado, para identificar sus propias reseñas. */
  readonly currentUser = input<string>('');

  // ── Estado local de UI ────────────────────────────────────────────
  /** Copia local para permitir add/edit/delete sin modificar el input. */
  readonly _reviews = signal<ProductReviewsItem[]>([]);
  /** Controla la visibilidad del composer de nueva reseña. */
  readonly _addDialogOpen = signal<boolean>(false);
  /** Índice de la reseña actualmente en edición (-1 = ninguna). */
  readonly _editingIdx = signal<number>(-1);
  /** Controla la visibilidad del composer de edición. */
  readonly _editDialogOpen = signal<boolean>(false);
  /** Texto/rating pre-relleno al editar una reseña. */
  readonly _editDraft = signal<{ text: string; rating: number } | null>(null);

  readonly _isEmpty = computed(() => this._reviews().length === 0);

  ngOnInit(): void {
    // Inicializar con los valores del input (no reactivo a cambios posteriores del input
    // ya que este es un demo template; en producción se usaría linkedSignal o effect)
    this._reviews.set(this.reviews());
  }

  // ── Handlers ─────────────────────────────────────────────────────

  openAddDialog(): void {
    this._addDialogOpen.set(true);
  }

  onReviewSubmit(payload: MComposerSubmit): void {
    const newReview: ProductReviewsItem = {
      user: this.currentUser() || 'Anónimo',
      avatar: '',
      date: new Date().toLocaleDateString('es-ES'),
      review: payload.text,
      rating: payload.rating ?? 5,
    };
    this._reviews.update(list => [newReview, ...list]);
  }

  startEdit(idx: number): void {
    const review = this._reviews()[idx];
    this._editingIdx.set(idx);
    this._editDraft.set({ text: review.review, rating: review.rating });
    this._editDialogOpen.set(true);
  }

  onEditSubmit(payload: MComposerSubmit): void {
    const idx = this._editingIdx();
    if (idx < 0) return;
    this._reviews.update(list =>
      list.map((r, i) =>
        i === idx ? { ...r, review: payload.text, rating: payload.rating ?? r.rating } : r
      )
    );
    this._editingIdx.set(-1);
    this._editDraft.set(null);
  }

  deleteReview(idx: number): void {
    this._reviews.update(list => list.filter((_, i) => i !== idx));
  }

  isOwn(review: ProductReviewsItem): boolean {
    return this.currentUser() !== '' && review.user === this.currentUser();
  }
}

