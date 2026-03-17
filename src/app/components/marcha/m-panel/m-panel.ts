import {
  Component, input, model, computed, signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import { MChip } from '../m-chip/m-chip';
import { MRipple } from '../m-ripple/m-ripple.directive';

export type MPanelSeverity = 'default' | 'info' | 'success' | 'warn' | 'danger';

@Component({
  selector: 'm-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MChip, MRipple],
  templateUrl: './m-panel.html',
  styleUrl: './m-panel.css',
})
export class MPanel {
  readonly header      = input('');
  readonly icon        = input('');
  readonly severity    = input<MPanelSeverity>('default');
  readonly collapsible = input(false);
  readonly filled      = input(false);
  readonly badge       = input('');

  /** Estado colapsado — enlazable con [(collapsed)] */
  readonly collapsed = model(false);

  readonly _iconMap = computed(() => {
    const map: Record<MPanelSeverity, string> = {
      default: 'lucide:panel-top',
      info:    'lucide:info',
      success: 'lucide:circle-check',
      warn:    'lucide:triangle-alert',
      danger:  'lucide:circle-x',
    };
    return this.icon() || map[this.severity()];
  });

  readonly _chipSeverityMap = computed(() => {
    const map: Record<MPanelSeverity, 'secondary' | 'info' | 'success' | 'warn' | 'danger'> = {
      default: 'secondary',
      info:    'info',
      success: 'success',
      warn:    'warn',
      danger:  'danger',
    };
    return map[this.severity()];
  });

  readonly _cssClass = computed(() => {
    const parts = [
      'm-panel',
      `m-panel--${this.severity()}`,
      this.filled()      ? 'm-panel--filled'      : '',
      this.collapsible() ? 'm-panel--collapsible'  : '',
      this.collapsed()   ? 'm-panel--collapsed'    : '',
    ];
    return parts.filter(Boolean).join(' ');
  });

  toggle(): void {
    if (!this.collapsible()) return;
    this.collapsed.update(v => !v);
  }
}
