import {
  Directive, input, signal,
  ElementRef, inject,
  HostListener, OnDestroy,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';

export type MTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[mTooltip]',
  standalone: true,
})
export class MTooltip implements OnDestroy {
  readonly mTooltip        = input.required<string>();
  readonly tooltipPosition = input<MTooltipPosition>('top');
  readonly tooltipDelay    = input(200);

  private readonly el = inject(ElementRef<HTMLElement>);
  private tip: HTMLDivElement | null = null;
  private showTimer = 0;
  private hideTimer = 0;

  @HostListener('mouseenter')
  @HostListener('focusin')
  onShow(): void {
    clearTimeout(this.hideTimer);
    this.showTimer = window.setTimeout(() => this.create(), this.tooltipDelay());
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  onHide(): void {
    clearTimeout(this.showTimer);
    this.hideTimer = window.setTimeout(() => this.destroy(), 80);
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    this.destroy();
  }

  private create(): void {
    this.destroy();
    const text = this.mTooltip();
    if (!text) return;

    const tip = document.createElement('div');
    tip.className = `m-tooltip m-tooltip--${this.tooltipPosition()}`;
    tip.textContent = text;
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
    this.tip = tip;
    this.position(tip);
  }

  private position(tip: HTMLDivElement): void {
    const host = this.el.nativeElement.getBoundingClientRect();
    const t    = tip.getBoundingClientRect();
    const gap  = 8;
    let top = 0, left = 0;

    switch (this.tooltipPosition()) {
      case 'top':
        top  = host.top  - t.height - gap + window.scrollY;
        left = host.left + (host.width - t.width) / 2 + window.scrollX;
        break;
      case 'bottom':
        top  = host.bottom + gap + window.scrollY;
        left = host.left + (host.width - t.width) / 2 + window.scrollX;
        break;
      case 'left':
        top  = host.top + (host.height - t.height) / 2 + window.scrollY;
        left = host.left - t.width - gap + window.scrollX;
        break;
      case 'right':
        top  = host.top + (host.height - t.height) / 2 + window.scrollY;
        left = host.right + gap + window.scrollX;
        break;
    }

    tip.style.top  = `${top}px`;
    tip.style.left = `${left}px`;
  }

  private destroy(): void {
    this.tip?.remove();
    this.tip = null;
  }
}
