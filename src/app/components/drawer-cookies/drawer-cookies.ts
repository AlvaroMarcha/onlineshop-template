import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drawer-cookies',
  imports: [PrimengModule, FormsModule],
  templateUrl: './drawer-cookies.html',
})
export class DrawerCookies {
  constructor(public router: Router) {}

  visible: boolean = true;

  preferences = {
    pref: true,
    stats: true,
    marketing: false,
  };

  showDialog() {
    this.visible = true;
  }

  acceptAll() {
    this.preferences = {
      pref: true,
      stats: true,
      marketing: true,
    };
    this.savePreferences();
  }

  rejectAll() {
    this.preferences = {
      pref: false,
      stats: false,
      marketing: false,
    };
    this.savePreferences();
  }

  savePreferences() {
    console.log('Preferencias guardadas:', this.preferences);
    this.visible = false;
    // Aquí podrías guardar en localStorage o backend
  }
}
