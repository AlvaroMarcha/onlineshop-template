import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginCard',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
  ],
  templateUrl: './loginCard.html',
  styleUrl: './loginCard.css',
})
export class LoginCard {
  userValue!: string;
  passwordValue!: string;

  constructor(public router: Router) {}
}
