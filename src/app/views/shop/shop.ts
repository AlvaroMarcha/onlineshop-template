import {
  Component, computed, OnInit, signal, Signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts } from '../../store/products/products.selector';
import { allProductsRequestInit } from '../../store/products/products.actions';
import { addToCart } from '../../store/cart/cart.actions';
import { Product, ProductCategory, ProductCartItem } from '../../type/types';
import { MDataview, MDataviewSortOption } from '../../components/marcha/m-dataview/m-dataview';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MChip } from '../../components/marcha/m-chip/m-chip';
import { MIcon } from '../../components/marcha/m-icon/m-icon';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [TranslateModule, RouterModule, CurrencyPipe, DecimalPipe,
            MDataview, MButton, MChip, MIcon],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  products$!: Signal<Product[]>;
  loading = signal(false);
  searchQuery = signal('');
  activeCategory = signal<number | null>(null);

  readonly sortOptions: MDataviewSortOption[] = [
    { label: 'Precio: menor a mayor', value: 'price_asc',  sortField: 'price', direction: 'asc' },
    { label: 'Precio: mayor a menor', value: 'price_desc', sortField: 'price', direction: 'desc' },
    { label: 'Nombre A–Z',            value: 'name_asc',   sortField: 'name',  direction: 'asc' },
    { label: 'Nombre Z–A',            value: 'name_desc',  sortField: 'name',  direction: 'desc' },
  ];

  readonly categories = computed<ProductCategory[]>(() => {
    const seen = new Set<number>();
    const cats: ProductCategory[] = [];
    for (const p of this.products$()) {
      for (const c of p.categories ?? []) {
        if (!seen.has(c.id)) { seen.add(c.id); cats.push(c); }
      }
    }
    return cats;
  });

  readonly filteredProducts = computed<Product[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const catId = this.activeCategory();
    return this.products$()
      .filter(p => p.active)
      .filter(p => !catId || p.categories.some(c => c.id === catId))
      .filter(p => !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query));
  });

  constructor(private store: Store) {
    this.products$ = toSignal(
      this.store.select(selectProducts),
      { initialValue: [] as Product[] },
    );
  }

  ngOnInit(): void {
    this.store.dispatch(allProductsRequestInit());
  }

  applyTilt(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (event.clientX - left) / width  - 0.5;
    const y = (event.clientY - top)  / height - 0.5;
    el.style.setProperty('--rx', `${(-y * 7).toFixed(1)}deg`);
    el.style.setProperty('--ry', `${ (x * 7).toFixed(1)}deg`);
  }

  clearTilt(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='72' text-anchor='middle' dy='.35em' fill='%239ca3af'%3E%F0%9F%93%A6%3C/text%3E%3C/svg%3E`;
  }

  addCart(product: Product): void {
    if (product.stock === 0) return;
    const item: ProductCartItem = {
      id:       product.id,
      name:     product.name,
      category: product.categories[0]?.name ?? '',
      price:    product.discountPrice ?? product.price,
      imageUrl: product.mainImageUrl ?? '',
      quantity: 1,
    };
    this.store.dispatch(addToCart({ item }));
  }
}

