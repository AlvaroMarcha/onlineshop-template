import {
  Component, input, model, computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export interface MTabItem {
  label:     string;
  icon?:     string;
  disabled?: boolean;
}

export type MTabsVariant = 'line' | 'pill';

@Component({
  selector: 'm-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-tabs.html',
  styleUrl: './m-tabs.css',
})
export class MTabs {
  readonly tabs    = input.required<MTabItem[]>();
  readonly active  = model(0);
  readonly variant = input<MTabsVariant>('line');

  readonly validTabs = computed(() => this.tabs());

  select(i: number) {
    if (!this.tabs()[i]?.disabled) {
      this.active.set(i);
    }
  }

  trackByIndex(i: number) { return i; }
}

/** Panel de contenido asociado a una pestaña. Muestra/oculta con @if en el padre. */
@Component({
  selector: 'm-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [':host { display: block; }'],
})
export class MTabPanel {
  readonly index = input.required<number>();
}
