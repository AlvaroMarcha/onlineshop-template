import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Terms } from '../../type/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-card',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    InputMaskModule,
    CheckboxModule,
    CommonModule,
  ],
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
      label: 'Acepto los terminos y condiciones',
    },
    {
      name: 'Privacy',
      value: false,
      label: 'Acepto la politica de privacidad',
    },
  ];
}
