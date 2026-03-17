import { Component, HostListener, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
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
import { MAvatar } from '../marcha/m-avatar/m-avatar';
import { Cart } from '../cart/cart';
import { UpButton } from '../up-button/up-button';
import { DrawerCookies } from '../drawer-cookies/drawer-cookies';

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
    MAvatar,
    Cart,
    UpButton,
    DrawerCookies,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  user$;

  // Marcha UI menu items
  menubarItems: MMenubarItem[] = [];
  itemsCartCount;
  totalAmount;
  visible = false;
  isDarkMode = false;
  isLogged;
  showUserMenu = false;

  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef;

  readonly _isMobile = signal(typeof window !== 'undefined' && window.innerWidth <= 768);

  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this._isMobile();
    const isMobile = window.innerWidth <= 768;
    this._isMobile.set(isMobile);
    
    // Regenerar menú si cambió de mobile a desktop o viceversa
    if (wasMobile !== isMobile) {
      this.generateMenus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showUserMenu && this.userMenuContainer) {
      const clickedInside = this.userMenuContainer.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.showUserMenu = false;
      }
    }
  }

  constructor(
    public router: Router,
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
    
    // Sincronizar estado del tema oscuro con el DOM
    if (typeof document !== 'undefined') {
      this.isDarkMode = document.querySelector('html')?.classList.contains('my-app-dark') || false;
    }
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
      'header.language',
    ]);

    // Marcha UI menubar items
    this.menubarItems = [
      { label: t['header.home'], icon: 'lucide:home' },
      { label: t['header.shop'], icon: 'lucide:shopping-bag' },
      { label: 'Galería', icon: 'lucide:images' },
      { label: t['header.contact'], icon: 'lucide:mail' },
      { label: t['header.about'], icon: 'lucide:info' },
      { label: 'Design System', icon: 'lucide:palette' },
    ];

    // Añadir item de idioma solo para mobile
    if (this._isMobile()) {
      this.menubarItems.push({
        label: t['header.language'],
        icon: 'lucide:globe',
        command: () => this.toggleLanguage(),
      });
    }
  }

  showDialog() {
    this.visible = true;
  }

  toggleLanguage() {
    const nextLang = this.lang.getCurrentLanguage() === 'es' ? 'en' : 'es';
    this.lang.changeLanguage(nextLang);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
      this.isDarkMode = element.classList.contains('my-app-dark');
      try { localStorage.setItem('dark-mode', String(this.isDarkMode)); } catch (e) {}
    }
  }

  clearCart() {
    this.store.dispatch(clearCart());
  }

  onMenuItemClick(item: MMenubarItem | MMenubarSubItem) {
    // Si el item tiene un comando, ejecutarlo
    if (item.command) {
      item.command();
      return;
    }
    
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
