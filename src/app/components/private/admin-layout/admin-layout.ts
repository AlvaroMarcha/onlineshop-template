import {
  Component, signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  readonly sidebarCollapsed    = signal(false);
  readonly mobileSidebarOpen   = signal(false);

  onToggleSidebar(): void {
    if (window.innerWidth < 768) {
      this.mobileSidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }

  onOverlayClick(): void {
    this.mobileSidebarOpen.set(false);
  }
}
