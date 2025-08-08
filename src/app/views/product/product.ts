import { Component } from '@angular/core';
import { Product } from '../../components/product-component/product-component';

@Component({
  selector: 'app-product',
  imports: [Product],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductView {}
