import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-header',
  imports: [Menubar, ImageModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
      },
      {
        label: 'Tienda',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Cat 1',
            icon: 'pi pi-bolt',
          },
          {
            label: 'Cat 2',
            icon: 'pi pi-server',
          },
          {
            label: 'Cat 3',
            icon: 'pi pi-pencil',
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
  }
}
