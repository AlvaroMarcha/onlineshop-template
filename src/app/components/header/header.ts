import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [Menubar, ImageModule, TieredMenuModule, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  items: MenuItem[] | undefined;
  itemsTiered: MenuItem[] | undefined;

  constructor(public router: Router) {}

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
        icon: 'pi pi-login',
        routerLink: 'login',
      },
    ];
  }
}
