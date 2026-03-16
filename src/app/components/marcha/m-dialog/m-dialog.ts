import {
  Component, model, input,
  ChangeDetectionStrategy, HostListener,
  OnDestroy, inject, DOCUMENT,
  effect,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import { MRipple } from '../m-ripple/m-ripple.directive';

export type MDialogSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MRipple],
  templateUrl: './m-dialog.html',
  styleUrl: './m-dialog.css',
})
export class MDialog implements OnDestroy {
  private readonly doc = inject(DOCUMENT);

  readonly visible   = model(false);
  readonly header    = input('');
  readonly closeable = input(true);
  readonly size      = input<MDialogSize>('md');

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.visible() ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.visible() && this.closeable()) {
      this.close();
    }
  }

  close() { this.visible.set(false); }

  onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget && this.closeable()) {
      this.close();
    }
  }

  ngOnDestroy() { this.doc.body.style.overflow = ''; }
}
