import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { Login } from './components/login/login';
import { PrimeNG } from 'primeng/config';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
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
