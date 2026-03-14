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
  }

  navigateToShop() {
    this.router.navigate(['/shop']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}
