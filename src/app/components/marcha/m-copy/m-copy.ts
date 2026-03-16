import { Component, signal, input, ChangeDetectionStrategy } from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

@Component({
  selector: 'm-copy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-copy.html',
  styleUrl: './m-copy.css',
})
export class MCopy {
  readonly text         = input('');
  readonly label        = input('Copiar');
  readonly successLabel = input('Copiado');
  readonly icon         = input('lucide:copy');
  readonly successIcon  = input('lucide:check');
  readonly variant      = input<'default' | 'ghost' | 'icon'>('default');
  readonly duration     = input(2000);

  readonly copied = signal(false);
  readonly error  = signal(false);

  private _timer: ReturnType<typeof setTimeout> | null = null;

  async copy(): Promise<void> {
    if (this.copied()) return;
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.set(true);
      this.error.set(false);
      if (this._timer) clearTimeout(this._timer);
      this._timer = setTimeout(() => this.copied.set(false), this.duration());
    } catch {
      this.error.set(true);
      this._timer = setTimeout(() => this.error.set(false), 2000);
    }
  }
}
