import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart } from '../cart/cart';
import { UpButton } from '../up-button/up-button';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  standalone: true,
  selector: 'app-header',
  providers: [MessageService],
  imports: [PrimengModule, Cart, UpButton, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  items: MenuItem[] | undefined;
  itemsTiered: MenuItem[] | undefined;
  visible = false;

  constructor(
    public router: Router,
    public messageService: MessageService,
    private translate: TranslateService
  ) {}

  currentLang = 'es';

  ngOnInit() {
    // Define the main menu items
    this.items = [
      {
        label: this.translate.instant('HEADER.MENU.HOME'),
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: this.translate.instant('HEADER.MENU.SHOP'),
        icon: 'pi pi-cart-minus',
        items: [
          {
            label: this.translate.instant('HEADER.MENU.CAT1'),
            icon: 'pi pi-list',
          },
          {
            label: this.translate.instant('HEADER.MENU.CAT2'),
            icon: 'pi pi-list',
          },
          {
            label: this.translate.instant('HEADER.MENU.CAT3'),
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: this.translate.instant('HEADER.MENU.CONTACT'),
        icon: 'pi pi-envelope',
        routerLink: '/contact',
      },
      {
        label: this.translate.instant('HEADER.MENU.ABOUT'),
        icon: 'pi pi-info-circle',
      },
    ];

    // Tiered menu items
    this.itemsTiered = [
      {
        label: this.translate.instant('HEADER.LOGIN'),
        icon: 'pi pi-user',
        routerLink: 'login',
      },
      {
        label: this.translate.instant('HEADER.REGISTER'),
        icon: 'pi pi-user-plus',
        routerLink: 'register',
      },
    ];
  }

  showDialog() {
    this.visible = true;
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
    this.ngOnInit();
  }

  showToastEmtpyCart() {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('HEADER.EMPTY_CART_SUMMARY'),
      detail: this.translate.instant('HEADER.EMPTY_CART_DETAIL'),
      life: 3000,
    });
  }
}
