import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language-service';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts } from '../../store/products/products.selector';
import { allProductsRequestInit } from '../../store/products/products.actions';
import { useDarkMode } from '../../shared/utils';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  products$;
  items: MenuItem[] | undefined;
  isMobile = window.matchMedia('(max-width: 600px)').matches;

  t!: Record<string, string>;
  layout: 'list' | 'grid' = 'grid';
  options = ['list', 'grid'];

  constructor(
    private lang: LanguageService,
    public router: Router,
    private store: Store
  ) {
    this.products$ = toSignal(this.store.select(selectProducts));
    effect(() => {
      console.log('Products updated:', this.products$()?.[0]?.urlImg);
    });
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

    this.items = [
      {
        label: 'Categorías',
        items: [
          {
            label: 'New',
            icon: 'pi pi-circle-on',
          },
          {
            label: 'Search',
            icon: 'pi pi-circle-on',
          },
          {
            label: 'New',
            icon: 'pi pi-circle-on',
          },
          {
            label: 'Search',
            icon: 'pi pi-circle-on',
          },
          {
            label: 'New',
            icon: 'pi pi-circle-on',
          },
          {
            label: 'Search',
            icon: 'pi pi-circle-on',
          },
        ],
      },
    ];
  }

  get isDarkMode() {
    return useDarkMode();
  }
}
