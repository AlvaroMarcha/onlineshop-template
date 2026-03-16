import { Component, effect, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormArray,
  FormControl,
} from '@angular/forms';
import { RegisterRequest } from '../../type/types';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { registerRequest } from '../../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from '../../store/auth/auth.selectors';
import { MCard } from '../marcha/m-card/m-card';
import { MInput } from '../marcha/m-input/m-input';
import { MPassword } from '../marcha/m-password/m-password';
import { MButton } from '../marcha/m-button/m-button';
import { MCheckbox } from '../marcha/m-checkbox/m-checkbox';
import { MNotificationService } from '../marcha/m-toast/m-notification.service';
import { MRipple } from '../marcha/m-ripple/m-ripple.directive';

export function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-card',
  imports: [ReactiveFormsModule, TranslateModule, RouterLink, MCard, MInput, MPassword, MButton, MCheckbox, MRipple],
  templateUrl: './registerCard.html',
  styleUrl: './registerCard.css',
})
export class RegisterCard {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  public router = inject(Router);
  private notificationSvc = inject(MNotificationService);

  registerForm = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [0, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      termsList: this.fb.nonNullable.array([
        this.fb.nonNullable.control(false),
        this.fb.nonNullable.control(false),
      ]),
    },
    { validators: passwordsMatchValidator }
  );

  loading = false;

  constructor() {
    const user$ = toSignal(this.store.select(selectUser));
    effect(() => {
      const user = user$();
      if (user) {
        if (user.roleName === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      
      if (this.registerForm.hasError('passwordsMismatch')) {
        this.notificationSvc.warn(
          'Las contraseñas no coinciden',
          'Por favor, asegúrate de que ambas contraseñas sean idénticas'
        );
        return;
      }
      
      this.notificationSvc.error(
        'Error de validación',
        'Por favor, completa todos los campos requeridos correctamente'
      );
      return;
    }
    
    const termsList = (this.registerForm.get('termsList') as FormArray<FormControl<boolean>>).value;
    if (!termsList.every((v) => v)) {
      this.notificationSvc.warn(
        'Términos pendientes',
        'Debes aceptar los términos y condiciones y la política de privacidad para continuar'
      );
      return;
    }
    
    const { name, surnames, username, email, phone, password } = this.registerForm.getRawValue();
    
    const payload: RegisterRequest = {
      name,
      surname: surnames,
      username,
      email,
      password,
      phone: phone.toString(),
      termsAccepted: true,
    };
    
    this.loading = true;
    this.store.dispatch(registerRequest({ payload }));
  }
}
