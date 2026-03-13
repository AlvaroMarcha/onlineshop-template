import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MButton, MCard, MIcon, MDivider,
  MAvatar, MBadge, MOverlayBadge,
  MInput, MPassword, MTextarea,
  MCheckbox, MNumberInput, MFloatLabel,
} from '../../components/marcha';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MButton, MCard, MIcon, MDivider,
    MAvatar, MBadge, MOverlayBadge,
    MInput, MPassword, MTextarea,
    MCheckbox, MNumberInput, MFloatLabel,
  ],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  loading = false;

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.minLength(8)),
    bio: new FormControl(''),
    cantidad: new FormControl(1),
    terminos: new FormControl(false),
  });

  toggleLoading() {
    this.loading = true;
    setTimeout(() => (this.loading = false), 2000);
  }
}
