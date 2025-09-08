import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-loginCard',
  imports: [FormsModule, PrimengModule, TranslateModule],
  templateUrl: './loginCard.html',
  styleUrl: './loginCard.css',
})
export class LoginCard {
  userValue!: string;
  passwordValue!: string;

  constructor(public router: Router, public auth: AuthService) {}

  login() {
    console.log('ENTRO', this.userValue, this.passwordValue);
    if (this.userValue === 'admin' && this.passwordValue === 'admin')
      this.auth.setAdmin(true);
    this.router.navigate(['/admin/dashboard']);
  }
}
