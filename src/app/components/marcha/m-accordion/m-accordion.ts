import {
  Component, input, signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MIcon } from '../m-icon/m-icon';
import { MRipple } from '../m-ripple/m-ripple.directive';

export interface MAccordionItem {
  header:    string;
  content:   string;
  icon?:     string;
  disabled?: boolean;
}

@Component({
  selector: 'm-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MRipple],
  templateUrl: './m-accordion.html',
  styleUrl: './m-accordion.css',
})
export class MAccordion {
  readonly items    = input.required<MAccordionItem[]>();
  readonly multiple = input(false);

  private readonly openSet = signal<Set<number>>(new Set());

  isOpen(i: number): boolean {
    return this.openSet().has(i);
  }

  toggle(i: number): void {
    if (this.items()[i]?.disabled) return;
    const s = new Set(this.openSet());
    if (s.has(i)) {
      s.delete(i);
    } else {
      if (!this.multiple()) s.clear();
      s.add(i);
    }
    this.openSet.set(s);
  }
}
