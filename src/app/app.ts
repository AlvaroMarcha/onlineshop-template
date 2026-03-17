import { Component, computed, effect, Signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MToast } from './components/marcha';
import { Store } from '@ngrx/store';
import { selectToken, selectUser } from './store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

const ADMIN_ROLES = [
  'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_STORE',
  'ROLE_ORDERS', 'ROLE_CUSTOMERS_INVOICES', 'ROLE_SUPPORT',
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Footer,
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
  readonly isAdminUrl: Signal<boolean | undefined>;

  readonly isAdmin = computed(() =>
    ADMIN_ROLES.includes(this.user$()?.roleName ?? ''),
  );

  constructor(
    private translate: TranslateService,
    public router: Router,
    private store: Store,
  ) {
    this.token$ = toSignal(this.store.select(selectToken));
    this.user$ = toSignal(this.store.select(selectUser));

    this.isAdminUrl = toSignal(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.router.url.startsWith('/admin')),
        startWith(this.router.url.startsWith('/admin')),
      ),
    );

    effect(() => {
      if (this.isAdmin() && !this.router.url.startsWith('/admin')) {
        this.router.navigateByUrl('/admin/dashboard');
      }
    });
  }

  ngOnInit() {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
  }
}
