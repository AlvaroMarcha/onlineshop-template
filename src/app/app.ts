import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { Login } from './components/login/login';
import { PrimeNG } from 'primeng/config';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'todo';

  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
