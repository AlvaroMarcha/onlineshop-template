import {
  Component, model, input,
  ChangeDetectionStrategy, HostListener,
  OnDestroy, inject, DOCUMENT,
  effect,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'm-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-drawer.html',
  styleUrl: './m-drawer.css',
})
export class MDrawer implements OnDestroy {
  private readonly doc = inject(DOCUMENT);

  readonly visible   = model(false);
  readonly header    = input('');
  readonly position  = input<MDrawerPosition>('right');
  readonly closeable = input(true);

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
