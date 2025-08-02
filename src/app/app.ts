import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { PrimengModule } from './shared/primeng/primeng-module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, PrimengModule, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'todo';

  constructor(private primeng: PrimeNG, private translate: TranslateService) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.translate.addLangs(['en', 'es']);
    this.translate.setFallbackLang('es');
  }
}
