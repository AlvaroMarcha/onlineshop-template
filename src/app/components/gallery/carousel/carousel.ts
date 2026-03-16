import { Component, OnInit } from '@angular/core';
import { ResponsiveOption } from '../../../type/types';

interface CarouselImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.html',
})
export class CarouselComponent implements OnInit {
  responsiveOptions!: ResponsiveOption[];
  images: CarouselImage[] = [
    {
      url: 'https://img.freepik.com/foto-gratis/vista-frontal-elegante-mujer-negocios-sosteniendo-portapapeles-espacio-copiar_23-2148788842.jpg',
      alt: 'Equipo desarrollando branding corporativo',
    },
    {
      url: 'https://img.freepik.com/foto-gratis/concepto-hombres-negocios-apreton-manos_53876-31214.jpg',
      alt: 'Elementos visuales con texto Corporate Brand',
    },
    {
      url: 'https://img.freepik.com/foto-gratis/empleador-parece-satisfecho-trabajo-lee-documentos-sonrie-satisfecho-pie_1258-26568.jpg',
      alt: 'Papelería corporativa sobre escritorio',
    },
    {
      url: 'https://img.freepik.com/foto-gratis/retrato-abogada-traje-formal-clipboard_23-2148915795.jpg',
      alt: 'Muestra de folleto de identidad corporativa',
    },
  ];
  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
