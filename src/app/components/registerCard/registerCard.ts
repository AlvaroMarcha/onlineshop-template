import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Terms } from '../../type/types';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-register-card',
  imports: [FormsModule, CommonModule, PrimengModule, TranslateModule],
  templateUrl: './registerCard.html',
  styleUrl: './registerCard.css',
})
export class RegisterCard implements OnInit {
  private t!: Record<string, string>;
  constructor(public router: Router, private lang: LanguageService) {}

  async ngOnInit() {
    this.t = await this.lang.tMany([
      'register.title',
      'register.form.terms',
      'register.form.privacy_policy',
    ]);
  }

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
      label: 'register.form.terms',
    },
    {
      name: 'Privacy',
      value: false,
      label: 'register.form.privacy_policy',
    },
  ];
}
