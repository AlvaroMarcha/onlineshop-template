import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Terms } from '../../type/types';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-card',
  imports: [FormsModule, CommonModule, PrimengModule, TranslateModule],
  templateUrl: './registerCard.html',
  styleUrl: './registerCard.css',
})
export class RegisterCard {
  constructor(public router: Router) {}

  userValue!: string;
  passwordValue1!: string;
  passwordValue2!: string;
  nameValue!: string;
  surnamesValue!: string;
  phoneValue!: number;
  emailValue!: string;

  legal: Terms[] = [
    {
      name: 'Terms',
      value: false,
      label: 'REGISTER.ACCEPT_TERMS',
    },
    {
      name: 'Privacy',
      value: false,
      label: 'REGISTER.ACCEPT_PRIVACY',
    },
  ];
}
