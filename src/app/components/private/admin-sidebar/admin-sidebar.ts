import {
  Component, input, computed,
  ChangeDetectionStrategy, inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { MIcon } from '../../marcha/m-icon/m-icon';
import { selectUser } from '../../../store/auth/auth.selectors';

interface AdminNavItem {
  labelKey: string;
  icon: string;
  route: string;
  roles: string[];
}

const NAV_ITEMS: AdminNavItem[] = [
  {
    labelKey: 'admin.nav.dashboard',
    icon: 'lucide:layout-dashboard',
    route: '/admin/dashboard',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
  },
  {
    labelKey: 'admin.nav.products',
    icon: 'lucide:package',
    route: '/admin/products',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_STORE'],
  },
  {
    labelKey: 'admin.nav.categories',
    icon: 'lucide:layers',
    route: '/admin/categories',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_STORE'],
  },
  {
    labelKey: 'admin.nav.attributes',
    icon: 'lucide:tag',
    route: '/admin/attributes',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_STORE'],
  },
  {
    labelKey: 'admin.nav.orders',
    icon: 'lucide:shopping-bag',
    route: '/admin/orders',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_ORDERS'],
  },
  {
    labelKey: 'admin.nav.users',
    icon: 'lucide:users',
    route: '/admin/users',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_CUSTOMERS_INVOICES'],
  },
  {
    labelKey: 'admin.nav.invoices',
    icon: 'lucide:file-text',
    route: '/admin/invoices',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_CUSTOMERS_INVOICES'],
  },
  {
    labelKey: 'admin.nav.inventory',
    icon: 'lucide:warehouse',
    route: '/admin/inventory',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_STORE'],
  },
];

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MIcon, TranslateModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  readonly collapsed = input(false);

  private readonly store = inject(Store);
  readonly user = toSignal(this.store.select(selectUser));

  readonly visibleItems = computed(() => {
    const role = this.user()?.roleName ?? '';
    return NAV_ITEMS.filter(item => item.roles.includes(role));
  });
}
