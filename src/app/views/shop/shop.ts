import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductItem } from '../../type/types';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  products: ProductItem[];
  t!: Record<string, string>;
  layout: 'list' | 'grid' = 'grid';
  options = ['list', 'grid'];

  constructor(private lang: LanguageService, public router: Router) {
    this.products = [];
  }

  async ngOnInit() {
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
        inventoryStatus: this.t['shop.low_stock'],
        category: 'Oficina',
      },
    ];
  }
}
