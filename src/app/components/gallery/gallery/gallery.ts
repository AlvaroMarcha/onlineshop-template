import { Component, OnInit, model, effect } from '@angular/core';
import { PrimengModule } from '../../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { ImgItem } from '../../../type/types';

@Component({
  selector: 'app-gallery',
  imports: [PrimengModule, CommonModule, FormsModule],
  templateUrl: './gallery.html',
})
export class Gallery implements OnInit {
  displayCustom = false;
  activeIndexPage = 0;
  activeIndex = 0;
  imagesData: ImgItem[] = [];

  // Paginator
  first: number = 0;
  rows: number = 4;

  constructor() {
    effect(() => {
      this.imagesData = this.images();
    });
  }

  // Datos (signal)
  images = model<ImgItem[]>([
    {
      itemImageSrc:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      alt: 'Montañas',
      thumbnailImageSrc:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      title: 'Paisaje 1',
    },
    {
      itemImageSrc:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      alt: 'Mar',
      thumbnailImageSrc:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      title: 'Paisaje 2',
    },
    {
      itemImageSrc:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      alt: 'Bosque',
      thumbnailImageSrc:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      title: 'Paisaje 3',
    },
    {
      itemImageSrc:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      alt: 'Desierto',
      thumbnailImageSrc:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      title: 'Paisaje 4',
    },
    {
      itemImageSrc:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
      alt: 'Carretera',
      thumbnailImageSrc:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
      title: 'Paisaje 5',
    },
  ]);

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  ngOnInit() {}

  // Trozo de imágenes según la página actual
  get pagedImages(): ImgItem[] {
    const start = this.first;
    const end = this.first + this.rows;
    return this.imagesData.slice(start, end);
  }

  // Total para el paginator
  get totalRecords(): number {
    return this.imagesData.length;
  }

  // Cambiar de página
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.activeIndexPage = 0; // resetea el slide visible dentro de la página
  }

  // Abrir fullscreen en el índice global correcto (si abres desde grid de miniaturas)
  openAt(globalIndex: number) {
    this.first = Math.floor(globalIndex / this.rows) * this.rows; // coloca la página
    this.activeIndexPage = globalIndex % this.rows; // índice relativo
    this.displayCustom = true;
  }

  imageClick(indexInPage: number) {
    this.activeIndexPage = indexInPage;
    this.displayCustom = true;
  }
}
