import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-up-button',
  imports: [ButtonModule],
  templateUrl: './up-button.html',
})
export class UpButton {
  scrollToHeader() {
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
  }
}
