import { Component, computed, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HeaderBack } from './components/private/header-back/header-back';
import { FooterBack } from './components/private/footer-back/footer-back';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MToast } from './components/marcha';
import { Store } from '@ngrx/store';
import { selectToken, selectUser } from './store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Footer,
    HeaderBack,
    FooterBack,
    RouterOutlet,
    TranslateModule,
    MToast,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'todo';
  token$;
  user$;

  //Computed
  isAdmin = computed(() => {
    return this.user$()?.role_id === 1;
  });

  constructor(
    private translate: TranslateService,
    public router: Router,
    private store: Store
  ) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));

    effect(() => {
      if (this.isAdmin()) {
        this.router.navigateByUrl('/admin/dashboard');
      }
    });
  }

  ngOnInit() {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
  }
}
