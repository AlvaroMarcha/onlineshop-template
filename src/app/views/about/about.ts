import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CarouselComponent } from '../../components/gallery/carousel/carousel';

@Component({
  selector: 'app-about',
  imports: [TranslateModule, CommonModule, PrimengModule, CarouselComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  team = [
    { name: 'Lorem', role: 'Dolor' },
    { name: 'Ipsum', role: 'Sit' },
    { name: 'Saxa', role: 'Amet' },
  ];
}
