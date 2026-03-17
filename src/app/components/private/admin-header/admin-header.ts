import {
  Component, input, output, computed,
  ChangeDetectionStrategy, inject,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { MIcon } from '../../marcha/m-icon/m-icon';
import { MAvatar } from '../../marcha/m-avatar/m-avatar';
import { selectUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

const SECTION_LABELS: Record<string, string> = {
  dashboard:  'admin.nav.dashboard',
  products:   'admin.nav.products',
  categories: 'admin.nav.categories',
  attributes: 'admin.nav.attributes',
  orders:     'admin.nav.orders',
  users:      'admin.nav.users',
  invoices:   'admin.nav.invoices',
  inventory:  'admin.nav.inventory',
};

@Component({
  selector: 'app-admin-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, MAvatar, TranslateModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  readonly collapsed     = input(false);
  readonly toggleSidebar = output<void>();

  private readonly store  = inject(Store);
  private readonly router = inject(Router);

  readonly user = toSignal(this.store.select(selectUser));

  readonly currentSection = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.getSection(this.router.url)),
      startWith(this.getSection(this.router.url)),
    ),
    { initialValue: '' },
  );

  readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.name.charAt(0)}${u.surname.charAt(0)}`.toUpperCase();
  });

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  private getSection(url: string): string {
    // /admin/orders/123 → 'orders'
    const segment = url.split('/')[2] ?? 'dashboard';
    return SECTION_LABELS[segment] ?? 'admin.layout.title';
  }
}
