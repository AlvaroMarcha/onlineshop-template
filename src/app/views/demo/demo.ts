import { Component } from '@angular/core';
import {
  MButton, MCard, MIcon, MDivider,
  MAvatar, MBadge, MOverlayBadge,
} from '../../components/marcha';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [MButton, MCard, MIcon, MDivider, MAvatar, MBadge, MOverlayBadge],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  loading = false;

  toggleLoading() {
    this.loading = true;
    setTimeout(() => (this.loading = false), 2000);
  }
}
