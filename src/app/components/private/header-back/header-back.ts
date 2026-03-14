import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../../store/auth/auth.actions';
import { MButton } from '../../marcha/m-button/m-button';
import { MAvatar } from '../../marcha/m-avatar/m-avatar';
import { MDrawer } from '../../marcha/m-drawer/m-drawer';
import { MIcon } from '../../marcha/m-icon/m-icon';

interface MenuItem {
  label: string;
  icon: string;
  command?: () => void;
  expanded?: boolean;
  items?: MenuItem[];
}

@Component({
  selector: 'app-header-back',
  imports: [MButton, MAvatar, MDrawer, MIcon],
  templateUrl: './header-back.html',
})
export class HeaderBack {
  drawerVisible = false;
  menuItems: MenuItem[] = [];

  constructor(public store: Store, public router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'lucide:home',
        command: () => this.router.navigate(['/admin/dashboard']),
      },
      {
        label: 'Usuarios',
        icon: 'lucide:users',
        expanded: false,
        items: [
          { label: 'Listado', icon: 'lucide:list' },
          { label: 'Roles', icon: 'lucide:shield' },
        ],
      },
      {
        label: 'Productos',
        icon: 'lucide:box',
        expanded: false,
        items: [
          { label: 'Inventario', icon: 'lucide:database' },
          { label: 'Categorías', icon: 'lucide:tags' },
        ],
      },
      {
        label: 'Pedidos',
        icon: 'lucide:shopping-cart',
      },
      {
        label: 'Ajustes',
        icon: 'lucide:settings',
      },
    ];
  }

  logout = () => {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  };
}
