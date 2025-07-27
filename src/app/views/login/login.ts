import { Component } from '@angular/core';
import { LoginCard } from '../../components/loginCard/loginCard';

@Component({
  selector: 'app-login',
  imports: [LoginCard],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
