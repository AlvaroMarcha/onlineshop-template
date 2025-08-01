import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';

@Component({
  selector: 'app-up-button',
  imports: [PrimengModule],
  templateUrl: './up-button.html',
})
export class UpButton {
  scrollToHeader() {
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
  }
}
