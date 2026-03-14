import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { MCard } from '../../components/marcha/m-card/m-card';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MBadge } from '../../components/marcha/m-badge/m-badge';
import { MChip } from '../../components/marcha/m-chip/m-chip';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init-page',
  imports: [TranslateModule, MCard, MButton, MBadge, MChip, MIcon],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitPage implements OnInit {
  t!: Record<string, string>;
  
  // Imagen de fondo del hero - preparada para ser dinámica desde el backend
  heroBackgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop';
  
  constructor(
    private lang: LanguageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.t = await this.lang.tMany([
      'home.banner.title',
      'home.banner.subtitle',
      'home.banner.button1',
      'home.banner.button2',
    ]);
    
    // TODO: Cargar imagen de fondo desde el backend
    // this.loadHeroBackground();
  }

  // TODO: Implementar cuando el backend esté listo
  // private async loadHeroBackground() {
  //   this.heroBackgroundImage = await this.settingsService.getHeroBackgroundImage();
  // }

  navigateToShop() {
    this.router.navigate(['/shop']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
