import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language-service';
import { ActivatedRoute } from '@angular/router';
import { GalleriaImage, ProductItem, SizesItems } from '../../type/types';
import { FormsModule } from '@angular/forms';
import { ProductReviews } from '../product-reviews/product-reviews';
import { MCard } from '../marcha/m-card/m-card';
import { MDialog } from '../marcha/m-dialog/m-dialog';
import { MAccordion } from '../marcha/m-accordion/m-accordion';
import { MButton } from '../marcha/m-button/m-button';
import { MSelect, MSelectOption } from '../marcha/m-select/m-select';
import { MIcon } from '../marcha/m-icon/m-icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-component',
  imports: [FormsModule, CommonModule, ProductReviews, MCard, MButton, MSelect, MIcon],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class Product implements OnInit {
  products: ProductItem[];
  singleProduct?: ProductItem;
  t!: Record<string, string>;
  id!: string;
  active: number = 0;
  images: GalleriaImage[] = [];
  sizes!: SizesItems[];
  selectedSize!: SizesItems;
  showImageDialog = false;

  constructor(private lang: LanguageService, private route: ActivatedRoute) {
    this.products = [];
  }

  /** Transforma SizesItems[] a MSelectOption[] para m-select */
  get sizesOptions(): MSelectOption[] {
    return this.sizes?.map(size => ({ label: size.name, value: size.code })) || [];
  }
  async ngOnInit() {
    //Recovery product ID from the route
    this.id = this.route.snapshot.paramMap.get('id') || '';
    // Fetching translations
    this.t = await this.lang.tMany([
      'shop.title',
      'shop.description',
      'shop.add_cart',
      'shop.buy_now',
      'shop.out_of_stock',
      'shop.low_stock',
      'shop.in_stock',
    ]);

    this.products = [
      {
        id: 'p001',
        name: 'Auriculares Bluetooth',
        description:
          'Auriculares inalámbricos con cancelación de ruido activa.',
        image: 'logos/principal.jpg',
        price: 59.99,
        inventoryStatus: this.t['shop.in_stock'],
        category: 'Electrónica',
      },
      {
        id: 'p002',
        name: 'Camiseta deportiva',
        description:
          'Camiseta transpirable para entrenamiento de alta intensidad.',
        image: 'logos/principal.jpg',
        price: 24.95,
        inventoryStatus: this.t['shop.low_stock'],
        category: 'Ropa',
      },
      {
        id: 'p003',
        name: 'Botella térmica',
        description: 'Botella de acero inoxidable que mantiene la temperatura.',
        image: 'logos/principal.jpg',
        price: 14.5,
        inventoryStatus: this.t['shop.in_stock'],
        category: 'Hogar',
      },
      {
        id: 'p004',
        name: 'Reloj inteligente',
        description: 'Reloj con monitor de ritmo cardíaco y GPS integrado.',
        image: 'logos/principal.jpg',
        price: 120.0,
        inventoryStatus: this.t['shop.in_stock'],
        category: 'Tecnología',
      },
      {
        id: 'p005',
        name: 'Teclado mecánico',
        description: 'Teclado retroiluminado con switches personalizados.',
        image: 'logos/principal.jpg',
        price: 89.9,
        inventoryStatus: this.t['shop.out_of_stock'],
        category: 'Oficina',
      },
    ];

    this.images = [
      {
        itemImageSrc: 'banners/principal-banner.jpg',
        thumbnailImageSrc: 'https://picsum.photos/id/1/250/150',
        alt: 'Imagen 1',
        title: 'Título 1',
      },
      {
        itemImageSrc: 'banners/principal-banner.jpg',
        thumbnailImageSrc: 'https://picsum.photos/id/2/250/150',
        alt: 'Imagen 2',
        title: 'Título 2',
      },
    ];

    this.sizes = [
      { name: 'XS', code: 'XS' },
      { name: 'S', code: 'S' },
      { name: 'M', code: 'M' },
      { name: 'L', code: 'L' },
      { name: 'XL', code: 'XL' },
    ];

    this.singleProduct = this.products.find(
      (product) => product.id === this.id
    );
  }

  nextImage() {
    this.active = (this.active + 1) % this.images.length;
  }

  prevImage() {
    this.active = (this.active - 1 + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    this.active = index;
  }
}
