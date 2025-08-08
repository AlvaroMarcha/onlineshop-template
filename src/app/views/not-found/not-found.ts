import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimengModule } from '../../shared/primeng/primeng-module';

@Component({
  selector: 'app-not-found',
  imports: [PrimengModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
