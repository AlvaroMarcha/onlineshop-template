import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MCard } from '../../components/marcha/m-card/m-card';

@Component({
  selector: 'app-not-found',
  imports: [MButton, MCard],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
