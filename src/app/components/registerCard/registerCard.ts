import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Terms } from '../../type/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-card',
  imports: [FormsModule, CommonModule, PrimengModule],
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
