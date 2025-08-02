import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _currentLang = 'es';

  constructor(private translate: TranslateService) {
    this.translate.use(this._currentLang);
  }

  async tMany(keys: string[]): Promise<Record<string, string>> {
    return await firstValueFrom(this.translate.get(keys));
  }

  async tOne(key: string): Promise<string> {
    return await firstValueFrom(this.translate.get(key));
  }

  changeLanguage(lang: string): void {
    this._currentLang = lang;
    this.translate.use(lang);
  }
  onLanguageChange(callback: () => void) {
    this.translate.onLangChange.subscribe(() => callback());
  }

  getCurrentLanguage(): string {
    return this._currentLang;
  }
}
