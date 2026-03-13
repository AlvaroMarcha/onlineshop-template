import {
  Component, input, output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MChipSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger' | 'info' | 'help';
export type MChipSize     = 'sm' | 'md' | 'lg';

@Component({
  selector: 'm-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-chip.html',
  styleUrl: './m-chip.css',
})
export class MChip {
  readonly label     = input.required<string>();
  readonly severity  = input<MChipSeverity>('secondary');
  readonly size      = input<MChipSize>('md');
  readonly icon      = input<string>();
  readonly removable = input(false);
  /** Muestra un punto de estado relleno (para Online/Offline/etc.) */
  readonly dot       = input(false);

  readonly removed = output<void>();

  remove(e: MouseEvent): void {
    e.stopPropagation();
    this.removed.emit();
  }
}
