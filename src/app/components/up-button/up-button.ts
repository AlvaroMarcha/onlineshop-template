import { Component } from '@angular/core';
import { MButton } from '../marcha/m-button/m-button';

@Component({
  selector: 'app-up-button',
  imports: [MButton],
  templateUrl: './up-button.html',
})
export class UpButton {
  scrollToHeader() {
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
  }
}
