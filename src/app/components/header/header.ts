import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart } from '../cart/cart';
import { UpButton } from '../up-button/up-button';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { ContactCard } from '../contact-card/contact-card';
@Component({
  standalone: true,
  selector: 'app-header',
  providers: [MessageService],
  imports: [PrimengModule, Cart, UpButton],
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
        routerLink: '/contact',
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
