import { Directive, ElementRef, HostListener, Renderer2, OnDestroy } from '@angular/core';

/**
 * m-ripple — Directiva para efecto Material Design Ripple
 *
 * Uso:
 *   <button mRipple>Click me</button>
 *   <div mRipple class="clickable">Card</div>
 *
 * El efecto ripple se aplica automáticamente en click/touch.
 * Compatible con cualquier elemento HTML.
 */
@Directive({
  selector: '[mRipple]',
  standalone: true,
})
export class MRipple implements OnDestroy {
  private rippleContainer: HTMLElement | null = null;
  private activeRipples = new Set<HTMLElement>();

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
    this.setupRippleContainer();
  }

  private setupRippleContainer(): void {
    const host = this.el.nativeElement;

    // Asegurar que el host tiene position: relative
    const position = window.getComputedStyle(host).position;
    if (position === 'static') {
      this.renderer.setStyle(host, 'position', 'relative');
    }

    // Asegurar overflow hidden para confinar el ripple
    this.renderer.setStyle(host, 'overflow', 'hidden');

    // Crear contenedor de ripples
    this.rippleContainer = this.renderer.createElement('span');
    this.renderer.addClass(this.rippleContainer, 'm-ripple-container');
    this.renderer.setStyle(this.rippleContainer, 'position', 'absolute');
    this.renderer.setStyle(this.rippleContainer, 'top', '0');
    this.renderer.setStyle(this.rippleContainer, 'left', '0');
    this.renderer.setStyle(this.rippleContainer, 'width', '100%');
    this.renderer.setStyle(this.rippleContainer, 'height', '100%');
    this.renderer.setStyle(this.rippleContainer, 'pointer-events', 'none');
    this.renderer.setStyle(this.rippleContainer, 'border-radius', 'inherit');
    this.renderer.setStyle(this.rippleContainer, 'z-index', '0');
    this.renderer.appendChild(host, this.rippleContainer);
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onInteraction(event: MouseEvent | TouchEvent): void {
    if (!this.rippleContainer) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    
    // Calcular posición del click/touch
    let x: number, y: number;
    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }

    // Crear elemento ripple
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'm-ripple');

    // Calcular tamaño del ripple (el diámetro debe cubrir el elemento completo)
    const size = Math.max(rect.width, rect.height) * 2;
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x - size / 2}px`);
    this.renderer.setStyle(ripple, 'top', `${y - size / 2}px`);

    // Estilos del ripple
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'border-radius', '50%');
    this.renderer.setStyle(ripple, 'background', 'currentColor');
    this.renderer.setStyle(ripple, 'opacity', '0.3');
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'animation', 'm-ripple-animation 0.6s ease-out');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');

    // Añadir al contenedor
    this.renderer.appendChild(this.rippleContainer, ripple);
    this.activeRipples.add(ripple);

    // Remover después de la animación
    setTimeout(() => {
      this.removeRipple(ripple);
    }, 600);
  }

  private removeRipple(ripple: HTMLElement): void {
    if (this.rippleContainer && ripple.parentNode === this.rippleContainer) {
      this.renderer.removeChild(this.rippleContainer, ripple);
      this.activeRipples.delete(ripple);
    }
  }

  ngOnDestroy(): void {
    // Limpiar ripples activos
    this.activeRipples.forEach(ripple => this.removeRipple(ripple));
    this.activeRipples.clear();

    // Remover contenedor
    if (this.rippleContainer && this.rippleContainer.parentNode) {
      this.renderer.removeChild(this.rippleContainer.parentNode, this.rippleContainer);
    }
  }
}
