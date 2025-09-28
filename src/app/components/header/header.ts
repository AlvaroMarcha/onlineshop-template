import { Component, OnInit, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart } from '../cart/cart';
import { UpButton } from '../up-button/up-button';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { FormsModule } from '@angular/forms';
import { Search } from '../search/search';
import { DrawerCookies } from '../drawer-cookies/drawer-cookies';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectIsLogged, selectUser } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
@Component({
  standalone: true,
  selector: 'app-header',
  providers: [MessageService],
  imports: [
    PrimengModule,
    Cart,
    UpButton,
    TranslateModule,
    FormsModule,
    Search,
    DrawerCookies,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  user$;

  items: MenuItem[] | undefined;
  clientItems: MenuItem[] | undefined;
  itemsTiered: MenuItem[] | undefined;
  visible = false;
  isDarkMode = false;
  isLogged: any;

  constructor(
    public router: Router,
    public messageService: MessageService,
    private lang: LanguageService,
    private store: Store
  ) {
    this.user$ = toSignal(this.store.select(selectUser), {
      initialValue: null,
    });

    this.isLogged = toSignal(this.store.select(selectIsLogged));
  }

  currentLang = 'es';

  async ngOnInit() {
    await this.generateMenus();
    this.lang.onLanguageChange(() => {
      this.generateMenus();
    });
  }

  async generateMenus() {
    const t = await this.lang.tMany([
      'header.home',
      'header.shop',
      'header.cat1',
      'header.cat2',
      'header.cat3',
      'header.contact',
      'header.about',
      'header.login',
      'header.register',
      'header.cart',
      'header.empty_cart_summary',
      'header.empty_cart_detail',
    ]);

    this.items = [
      { label: t['header.home'], icon: 'pi pi-home', routerLink: '/' },
      {
        label: t['header.shop'],
        icon: 'pi pi-cart-minus',
        routerLink: '/shop',
        items: [
          { label: t['header.cat1'], icon: 'pi pi-list' },
          { label: t['header.cat2'], icon: 'pi pi-list' },
          { label: t['header.cat3'], icon: 'pi pi-list' },
        ],
      },
      {
        label: 'Galería', // Falta traducciones
        icon: 'pi pi-images',
        routerLink: '/gallery',
      },
      {
        label: t['header.contact'],
        icon: 'pi pi-envelope',
        routerLink: '/contact',
      },
      {
        label: t['header.about'],
        icon: 'pi pi-info-circle',
        routerLink: '/about',
      },
    ];

    this.itemsTiered = [
      { label: t['header.login'], icon: 'pi pi-user', routerLink: 'login' },
      {
        label: t['header.register'],
        icon: 'pi pi-user-plus',
        routerLink: 'register',
      },
      {
        separator: true,
      },
      {
        label: 'Idioma',
        icon: 'pi pi-globe',
        command: () => {
          this.toggleLanguage();
        },
      },
    ];

    this.clientItems = [
      {
        label: 'Perfil',
        icon: 'pi pi-user-edit',
        command: () => {
          this.router.navigate(['/profile']);
        },
      },
      {
        separator: true,
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.store.dispatch(logout());
          this.router.navigate(['/']);
        },
      },
    ];
  }

  showDialog() {
    this.visible = true;
  }

  toggleLanguage() {
    const nextLang = this.lang.getCurrentLanguage() === 'es' ? 'en' : 'es';
    this.lang.changeLanguage(nextLang);
  }
  async showToastEmtpyCart() {
    const t = await this.lang.tMany([
      'header.empty_cart_summary',
      'header.empty_cart_detail',
    ]);

    this.messageService.add({
      severity: 'success',
      summary: t['header.empty_cart_summary'],
      detail: t['header.empty_cart_detail'],
      life: 3000,
    });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
      this.isDarkMode = true;
    }
  }
}
