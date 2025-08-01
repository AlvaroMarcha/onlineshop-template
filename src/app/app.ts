import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { PrimengModule } from './shared/primeng/primeng-module';
// import { TranslateConfigModule } from './shared/translate/translate-module';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Footer,
    RouterOutlet,
    PrimengModule /*TranslateConfigModule*/,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'todo';

  constructor(private primeng: PrimeNG, private translate: TranslateService) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}
