import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [CardModule, ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
