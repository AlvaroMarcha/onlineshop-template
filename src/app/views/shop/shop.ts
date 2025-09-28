import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language-service';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts } from '../../store/products/products.selector';
import { allProductsRequestInit } from '../../store/products/products.actions';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  products$;
  tempUrlImg = 'logos/principal.jpg';

  t!: Record<string, string>;
  layout: 'list' | 'grid' = 'grid';
  options = ['list', 'grid'];

  constructor(
    private lang: LanguageService,
    public router: Router,
    private store: Store
  ) {
    this.products$ = toSignal(this.store.select(selectProducts));
  }

  async ngOnInit() {
    this.store.dispatch(allProductsRequestInit());

    this.t = await this.lang.tMany([
      'shop.title',
      'shop.description',
      'shop.add_cart',
      'shop.buy_now',
      'shop.out_of_stock',
      'shop.low_stock',
      'shop.in_stock',
    ]);
  }

  get isDarkMode() {
    return document.documentElement.classList.contains('my-app-dark');
  }
}
