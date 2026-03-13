import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { createClientUser, PayloadFormRegister, Terms } from '../../type/types';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { Store } from '@ngrx/store';
import { registerRequest } from '../../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  selectIsLogged,
  selectToken,
  selectUser,
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-register-card',
  imports: [FormsModule, CommonModule, PrimengModule, TranslateModule],
  templateUrl: './registerCard.html',
  styleUrl: './registerCard.css',
})
export class RegisterCard implements OnInit {
  private t!: Record<string, string>;
  user$;
  token$;

  validation = signal('');
  severityValidation = 'warn';
  loading: boolean = false;

  isLogged;

  payloadForm: PayloadFormRegister = {
    userValue: '',
    passwordValue1: '',
    passwordValue2: '',
    nameValue: '',
    surnamesValue: '',
    phoneValue: 0,
    emailValue: '',
  };

  constructor(
    private store: Store,
    public router: Router,
    private lang: LanguageService
  ) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));
    this.isLogged = toSignal(this.store.select(selectIsLogged));

    effect(() => {
      const user = this.user$();
      if (user) {
        if (user.role_id === 1) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  async ngOnInit() {
    this.t = await this.lang.tMany([
      'register.title',
      'register.form.terms',
      'register.form.privacy_policy',
    ]);
  }

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

  onRegister(payload: PayloadFormRegister = this.payloadForm) {
    const payloadRequest: createClientUser = {
      client: {
        id: null,
        first_name: payload.nameValue,
        last_name: payload.surnamesValue,
        email: payload.emailValue,
        phone: payload.phoneValue,
      },
      user: {
        id: null,
        name: payload.nameValue,
        username: payload.userValue,
        password: payload.passwordValue1,
        email: payload.emailValue,
        phone: payload.phoneValue,
        status: true,
        locked: false,
        created_at: new Date().toISOString(),
      },
      role: {
        id: 4,
        // role_name: 'CLIENT' // ? Optional
      },
    };

    //SetTimeout
    this.loading = true;
    setTimeout(() => {
      this.getValidationRegister(payloadRequest);
      this.loading = false;
    }, 1200);
  }

  getValidationRegister(payload: createClientUser): void {
    const isSomeEmpty = Object.values(payload).some((value) => value === '');
    const isUserEqual = this.payloadForm.userValue === payload.user.username;
    const isPassEqual =
      this.payloadForm.passwordValue1 === payload.user.password;
    const comparePass =
      this.payloadForm.passwordValue1 !== this.payloadForm.passwordValue2;

    const checkboxsChecked = this.legal.every((term) => term.value === true);

    if (isSomeEmpty) {
      this.severityValidation = 'error';
      this.validation.set('Los campos son obligatorios');
    } else {
      if (isUserEqual && isPassEqual) {
        if (!checkboxsChecked) {
          this.severityValidation = 'warn';
          return this.validation.set('Acepte los términos y condiciones');
        }
        this.store.dispatch(registerRequest({ payload }));
      }

      if (comparePass) {
        this.severityValidation = 'warn';
        this.validation.set('Las contraseñas no coinciden');
      }
    }
  }
}
