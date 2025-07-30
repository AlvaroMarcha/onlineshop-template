import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; // Import ButtonModule for p-button

@Component({
  selector: 'app-init-page',
  imports: [
    AnimateOnScrollModule,
    AvatarModule,
    DividerModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
  standalone: true,
})
export class InitPage {}
