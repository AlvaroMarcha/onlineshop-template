import {
  Component, input, computed, signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export type MMessageSeverity = 'info' | 'success' | 'warn' | 'error';

@Component({
  selector: 'm-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-message.html',
  styleUrl: './m-message.css',
})
export class MMessage {
  readonly severity  = input<MMessageSeverity>('info');
  readonly title     = input('');
  readonly text      = input('');
  readonly closeable = input(false);

  readonly closed = signal(false);

  readonly icon = computed(() => {
    const map: Record<MMessageSeverity, string> = {
      info:    'lucide:info',
      success: 'lucide:circle-check',
      warn:    'lucide:triangle-alert',
      error:   'lucide:circle-x',
    };
    return map[this.severity()];
  });

  close() { this.closed.set(true); }
}
