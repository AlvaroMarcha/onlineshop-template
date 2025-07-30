import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { Product } from '../../type/types';
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [
    ButtonModule,
    TagModule,
    CommonModule,
    DataViewModule,
    InputNumber,
    FormsModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  products: Product[] = [
    {
      id: '1',
      name: 'Camiseta Básica',
      description:
        'Camiseta de algodón 100% para uso diario, disponible en varios colores.',
      image: 'logos/principal.jpg',
      price: 19.99,
      inventoryStatus: 'Stock',
      category: 'Ropa',
    },
    {
      id: '2',
      name: 'Zapatos Deportivos',
      description:
        'Zapatos deportivos diseñados para correr y entrenar cómodamente.',
      image: 'logos/principal.jpg',
      price: 49.99,
      inventoryStatus: 'Bajo Stock',
      category: 'Calzado',
    },
    {
      id: '3',
      name: 'Auriculares Bluetooth',
      description:
        'Auriculares inalámbricos con cancelación de ruido y batería de larga duración.',
      image: 'logos/principal.jpg',
      price: 89.99,
      inventoryStatus: 'Fuera de Stock',
      category: 'Electrónica',
    },
    {
      id: '4',
      name: 'Mochila de Senderismo',
      description:
        'Mochila resistente con múltiples compartimentos para tus aventuras al aire libre.',
      image: 'logos/principal.jpg',
      price: 29.99,
      inventoryStatus: 'Stock',
      category: 'Accesorios',
    },
    {
      id: '5',
      name: 'Reloj Inteligente',
      description:
        'Reloj inteligente con monitoreo de actividad física y notificaciones de teléfono.',
      image: 'logos/principal.jpg',
      price: 199.99,
      inventoryStatus: 'Stock',
      category: 'Electrónica',
    },
  ];
}
