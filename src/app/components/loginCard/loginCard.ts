import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-loginCard',
  imports: [FormsModule, PrimengModule, TranslateModule],
  templateUrl: './loginCard.html',
  styleUrl: './loginCard.css',
})
export class LoginCard {
  userValue!: string;
  passwordValue!: string;

  constructor(public router: Router) {}
}
