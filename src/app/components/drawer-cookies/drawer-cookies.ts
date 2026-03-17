import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MDialog } from '../marcha/m-dialog/m-dialog';
import { MButton } from '../marcha/m-button/m-button';
import { MIcon } from '../marcha/m-icon/m-icon';
import { MChip } from '../marcha/m-chip/m-chip';
import { MToggleSwitch } from '../marcha/m-toggle-switch/m-toggle-switch';

const COOKIE_VERSION = '1.0';

@Component({
  selector: 'app-drawer-cookies',
  standalone: true,
  imports: [FormsModule, TranslateModule, MDialog, MButton, MIcon, MChip, MToggleSwitch],
  templateUrl: './drawer-cookies.html',
  styleUrl: './drawer-cookies.css',
})
export class DrawerCookies {
  constructor(public router: Router) {
    const saved = localStorage.getItem('cookie-preferences');
    const savedVersion = localStorage.getItem('cookie-version');

    if (saved && savedVersion === COOKIE_VERSION) {
      this.preferences = JSON.parse(saved);
      this._bannerVisible.set(false);
    }
  }

  readonly _bannerVisible = signal(true);
  readonly _settingsOpen  = signal(false);

  preferences = {
    pref: true,
    stats: true,
    marketing: false,
  };

  openSettings(): void {
    this._settingsOpen.set(true);
  }

  acceptAll(): void {
    this.preferences = { pref: true, stats: true, marketing: true };
    this._save();
  }

  rejectAll(): void {
    this.preferences = { pref: false, stats: false, marketing: false };
    this._save();
  }

  savePreferences(): void {
    this._settingsOpen.set(false);
    this._save();
  }

  /** Llamado desde fuera (ej: footer) para volver a mostrar el banner */
  showBanner(): void {
    this._bannerVisible.set(true);
  }

  private _save(): void {
    this._bannerVisible.set(false);
    localStorage.setItem('cookie-preferences', JSON.stringify(this.preferences));
    localStorage.setItem('cookie-version', COOKIE_VERSION);
    document.cookie = `cookiePrefs=${encodeURIComponent(
      JSON.stringify(this.preferences)
    )}; path=/; max-age=31536000`;
  }
}

