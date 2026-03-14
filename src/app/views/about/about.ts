import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MCard } from '../../components/marcha/m-card/m-card';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { CarouselComponent } from '../../components/gallery/carousel/carousel';

@Component({
  selector: 'app-about',
  imports: [TranslateModule, CommonModule, MCard, MButton, MIcon, CarouselComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  team = [
    { name: 'Lorem', role: 'Dolor' },
    { name: 'Ipsum', role: 'Sit' },
    { name: 'Saxa', role: 'Amet' },
  ];

  constructor(public router: Router) {}
}
