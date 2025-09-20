import { ApplicationConfig, Component } from '@angular/core';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HeaderBack } from './components/private/header-back/header-back';
import { FooterBack } from './components/private/footer-back/footer-back';
import { PrimengModule } from './shared/primeng/primeng-module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Footer,
    HeaderBack,
    FooterBack,
    RouterOutlet,
    PrimengModule,
    TranslateModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'todo';

  constructor(
    private primeng: PrimeNG,
    private translate: TranslateService,
    private auth: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.translate.addLangs(['en', 'es']);
    // this.translate.setFallbackLang('es');
    this.translate.setDefaultLang('es');
  }
}
