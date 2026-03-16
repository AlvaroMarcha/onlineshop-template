import { Component, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MIcon } from '../marcha/m-icon/m-icon';
import { MButton } from '../marcha/m-button/m-button';
import { MRipple } from '../marcha/m-ripple/m-ripple.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, MIcon, MButton, MRipple],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();
  showScrollTop = signal(false);

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.scrollToTop();
  }
}
