import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Cart } from '../cart/cart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UpButton } from '../up-button/up-button';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    Menubar,
    ImageModule,
    TieredMenuModule,
    ButtonModule,
    DialogModule,
    Cart,
    ToastModule,
    UpButton,
  ],
  providers: [MessageService],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  items: MenuItem[] | undefined;
  itemsTiered: MenuItem[] | undefined;
  visible = false;

  constructor(public router: Router, public messageService: MessageService) {}

  ngOnInit() {
    // Define the main menu items
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: 'Tienda',
        icon: 'pi pi-cart-minus',
        items: [
          {
            label: 'Cat 1',
            icon: 'pi pi-list',
          },
          {
            label: 'Cat 2',
            icon: 'pi pi-list',
          },
          {
            label: 'Cat 3',
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
      },
      {
        label: 'Nosotros',
        icon: 'pi pi-info-circle',
      },
    ];

    // Tiered menu items
    this.itemsTiered = [
      {
        label: 'Iniciar sesión',
        icon: 'pi pi-user',
        routerLink: 'login',
      },
      {
        label: 'Registrarse',
        icon: 'pi pi-user-plus',
        routerLink: 'register',
      },
    ];
  }

  showDialog() {
    this.visible = true;
  }

  showToastEmtpyCart() {
    this.messageService.add({
      severity: 'success',
      summary: 'Carrito vaciado',
      detail: 'No tienes nada en el carrito',
      life: 3000,
    });
  }
}
