import { Component, OnInit, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectIsLogged, selectUser } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { clearCart } from '../../store/cart/cart.actions';
import {
  selectCartCount,
  selectCartTotal,
} from '../../store/cart/cart.selector';
import { MMenubar, MMenubarItem, MMenubarSubItem } from '../marcha/m-menubar/m-menubar';
import { MButton } from '../marcha/m-button/m-button';
import { MOverlayBadge } from '../marcha/m-overlay-badge/m-overlay-badge';
import { MDialog } from '../marcha/m-dialog/m-dialog';
import { MCard } from '../marcha/m-card/m-card';
import { Cart } from '../cart/cart';
import { UpButton } from '../up-button/up-button';
import { DrawerCookies } from '../drawer-cookies/drawer-cookies';
import { PrimengModule } from '../../shared/primeng/primeng-module';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    TranslateModule,
    FormsModule,
    MMenubar,
    MButton,
    MOverlayBadge,
    MDialog,
    MCard,
    Cart,
    UpButton,
    DrawerCookies,
    PrimengModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  user$;

  items: MenuItem[] | undefined;
  // Marcha UI menu items
  menubarItems: MMenubarItem[] = [];
  itemsCartCount;
  totalAmount;
  clientItems: MenuItem[] | undefined;
  itemsTiered: MenuItem[] | undefined;
  visible = false;
  isDarkMode = false;
  isLogged;
  showUserMenu = false;

  constructor(
    public router: Router,
    public messageService: MessageService,
    private lang: LanguageService,
    private store: Store
  ) {
    this.isLogged = toSignal(this.store.select(selectIsLogged));
    this.user$ = toSignal(this.store.select(selectUser), {
      initialValue: null,
    });

    this.totalAmount = toSignal(this.store.select(selectCartTotal));
    this.itemsCartCount = toSignal(this.store.select(selectCartCount), {
      initialValue: 0,
    });
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

    // PrimeNG items (para retrocompatibilidad si se necesitan)
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
        label: 'Galería',
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
      {
        label: 'Design System',
        icon: 'pi pi-palette',
        routerLink: '/demo',
      },
    ];

    // Marcha UI menubar items
    this.menubarItems = [
      { label: t['header.home'], icon: 'lucide:home' },
      {
        label: t['header.shop'],
        icon: 'lucide:shopping-bag',
        items: [
          { label: t['header.cat1'], icon: 'lucide:tag' },
          { label: t['header.cat2'], icon: 'lucide:tag' },
          { label: t['header.cat3'], icon: 'lucide:tag' },
        ],
      },
      { label: 'Galería', icon: 'lucide:images' },
      { label: t['header.contact'], icon: 'lucide:mail' },
      { label: t['header.about'], icon: 'lucide:info' },
      { label: 'Design System', icon: 'lucide:palette' },
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

  clearCart() {
    this.store.dispatch(clearCart());
  }

  onMenuItemClick(item: MMenubarItem | MMenubarSubItem) {
    // Mapeo de navegación
    const routes: Record<string, string> = {
      'Inicio': '/',
      'Home': '/',
      'Tienda': '/shop',
      'Shop': '/shop',
      'Galería': '/gallery',
      'Gallery': '/gallery',
      'Contacto': '/contact',
      'Contact': '/contact',
      'Acerca de': '/about',
      'About': '/about',
      'Design System': '/demo',
    };
    
    const route = routes[item.label || ''];
    if (route) {
      this.router.navigate([route]);
    }
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  onProfileClick() {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  onLogoutClick() {
    this.showUserMenu = false;
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onRegisterClick() {
    this.router.navigate(['/register']);
  }
}
