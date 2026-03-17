import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User, ProductReviewsItem } from '../../type/types';
import { MComposer, MComposerSubmit } from '../marcha/m-composer/m-composer';
import { MRating } from '../marcha/m-rating/m-rating';
import { MAvatar } from '../marcha/m-avatar/m-avatar';
import { MButton } from '../marcha/m-button/m-button';
import { MIcon } from '../marcha/m-icon/m-icon';
import { MDivider } from '../marcha/m-divider/m-divider';
import { MChip } from '../marcha';
import { MDialog } from '../marcha/m-dialog/m-dialog';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MComposer, MRating, MAvatar, MButton, MIcon, MDivider, MChip, TranslateModule, MDialog],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews {
  /** Reviews del producto (pasadas por el padre desde el estado del store). */
  readonly reviews    = input<ProductReviewsItem[]>([]);
  /** Usuario autenticado, para identificar sus propias reseñas. */
  readonly currentUser = input<User | null>(null);
  /** Emite el rating recalculado cuando la lista de reseñas cambia. */
  readonly ratingChange = output<{ rating: number; count: number }>();

  // ── Estado local de UI ────────────────────────────────────────────
  readonly _reviews       = signal<ProductReviewsItem[]>([]);
  readonly _addDialogOpen  = signal<boolean>(false);
  readonly _editingIdx     = signal<number>(-1);
  readonly _editDialogOpen = signal<boolean>(false);
  readonly _editDraft      = signal<{ text: string; rating: number } | null>(null);

  /** Índice de reseña pendiente de confirmación de borrado (-1 = ninguna). */
  readonly _deleteConfirmIdx   = signal<number>(-1);
  readonly _deleteConfirmOpen  = signal<boolean>(false);

  readonly _isEmpty = computed(() => this._reviews().length === 0);

  /** Rating medio + nº reseñas calculados desde la lista local. */
  readonly _stats = computed(() => {
    const list = this._reviews();
    const count = list.length;
    if (count === 0) return { rating: 0, count: 0 };
    return { rating: list.reduce((s, r) => s + r.rating, 0) / count, count };
  });

  ngOnInit(): void {
    this._reviews.set(this.reviews());
    // Emitir el estado inicial para que el padre sincronice desde el principio
    this.ratingChange.emit(this._stats());
  }

  // ── Helpers ──────────────────────────────────────────────────────

  displayName(review: ProductReviewsItem): string {
    return `${review.user.name} ${review.user.surname}`.trim();
  }

  isOwn(review: ProductReviewsItem): boolean {
    const u = this.currentUser();
    return u !== null && u.id === review.user.userId;
  }

  // ── Handlers ─────────────────────────────────────────────────────

  openAddDialog(): void {
    this._addDialogOpen.set(true);
  }

  onReviewSubmit(payload: MComposerSubmit): void {
    const u = this.currentUser();
    const comment = payload.text ?? '';
    const newReview: ProductReviewsItem = {
      id: Date.now(),
      productId: 0,
      user: { userId: u?.id ?? 0, name: u?.name ?? 'Anónimo', surname: u?.surname ?? '' },
      rating: payload.rating ?? 5,
      title: comment ? comment.split('.')[0].substring(0, 60).trim() : '',
      comment,
      likes: 0,
      dislikes: 0,
      active: true,
    };
    this._reviews.update(list => [newReview, ...list]);
    this.ratingChange.emit(this._stats());
  }

  startEdit(idx: number): void {
    const review = this._reviews()[idx];
    this._editingIdx.set(idx);
    this._editDraft.set({ text: review.comment, rating: review.rating });
    this._editDialogOpen.set(true);
  }

  onEditSubmit(payload: MComposerSubmit): void {
    const idx = this._editingIdx();
    if (idx < 0) return;
    this._reviews.update(list =>
      list.map((r, i) =>
        i === idx ? { ...r, comment: payload.text, rating: payload.rating ?? r.rating } : r
      )
    );
    this._editingIdx.set(-1);
    this._editDraft.set(null);
    this.ratingChange.emit(this._stats());
  }

  deleteReview(idx: number): void {
    this._reviews.update(list => list.filter((_, i) => i !== idx));
    this.ratingChange.emit(this._stats());
  }

  requestDelete(idx: number): void {
    this._deleteConfirmIdx.set(idx);
    this._deleteConfirmOpen.set(true);
  }

  confirmDelete(): void {
    const idx = this._deleteConfirmIdx();
    if (idx >= 0) this.deleteReview(idx);
    this._deleteConfirmOpen.set(false);
    this._deleteConfirmIdx.set(-1);
  }

  cancelDelete(): void {
    this._deleteConfirmOpen.set(false);
    this._deleteConfirmIdx.set(-1);
  }
}

