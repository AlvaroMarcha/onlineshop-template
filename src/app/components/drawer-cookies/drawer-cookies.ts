import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const COOKIE_VERSION = '1.0';
@Component({
  selector: 'app-drawer-cookies',
  imports: [PrimengModule, FormsModule],
  templateUrl: './drawer-cookies.html',
})
export class DrawerCookies {
  constructor(public router: Router) {
    const saved = localStorage.getItem('cookie-preferences');
    const savedVersion = localStorage.getItem('cookie-version');

    if (saved && savedVersion === COOKIE_VERSION) {
      this.preferences = JSON.parse(saved);
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

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
    this.visible = false;

    //Save cookies
    localStorage.setItem(
      'cookie-preferences',
      JSON.stringify(this.preferences)
    );

    localStorage.setItem('cookie-version', COOKIE_VERSION);

    //Save during 1 year
    document.cookie = `cookiePrefs=${encodeURIComponent(
      JSON.stringify(this.preferences)
    )}; path=/; max-age=31536000`;

    // TODO REVISAR!!
    // Upload script for google analytics
    if (this.preferences.stats) {
      // this.loadAnalytics();
    }
    //Upload script for marketing
    if (this.preferences.marketing) {
      // this.loadMarketing();
    }
  }
}
