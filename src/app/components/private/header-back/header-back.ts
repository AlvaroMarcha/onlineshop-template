import { Component, ViewChild } from '@angular/core';
import { PrimengModule } from '../../../shared/primeng/primeng-module';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-back',
  imports: [PrimengModule],
  templateUrl: './header-back.html',
})
export class HeaderBack {
  drawerVisible = false;
  menuItems: MenuItem[] = [];

  constructor(public auth: AuthService, public router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => console.log('Ir a Dashboard'),
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        expanded: false,
        items: [
          { label: 'Listado', icon: 'pi pi-list' },
          { label: 'Roles', icon: 'pi pi-shield' },
        ],
      },
      {
        label: 'Productos',
        icon: 'pi pi-box',
        expanded: false,
        items: [
          { label: 'Inventario', icon: 'pi pi-database' },
          { label: 'Categorías', icon: 'pi pi-tags' },
        ],
      },
      {
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
      },
      {
        label: 'Ajustes',
        icon: 'pi pi-cog',
      },
    ];
  }

  logout = () => {
    this.router.navigate(['/']);
  };
}
