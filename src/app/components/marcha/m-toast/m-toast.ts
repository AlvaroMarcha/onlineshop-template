import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import {
  MNotificationService,
  MToastItem,
  MToastSeverity,
} from './m-notification.service';

@Component({
  selector: 'm-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-toast.html',
  styleUrl: './m-toast.css',
})
export class MToast {
  protected readonly svc = inject(MNotificationService);

  icon(severity: MToastSeverity): string {
    const map: Record<MToastSeverity, string> = {
      info:    'lucide:info',
      success: 'lucide:circle-check',
      warn:    'lucide:triangle-alert',
      error:   'lucide:circle-x',
    };
    return map[severity];
  }

  close(id: number) { this.svc.remove(id); }

  trackById(_: number, t: MToastItem) { return t.id; }
}
