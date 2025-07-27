import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-init-page',
  imports: [AnimateOnScrollModule, AvatarModule, DividerModule, CardModule],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
  standalone: true,
})
export class InitPage {}
