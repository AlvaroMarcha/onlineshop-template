import { Component, computed, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts } from '../../store/products/products.selector';
import { allProductsRequestInit } from '../../store/products/products.actions';
import { addToCart } from '../../store/cart/cart.actions';
import { Product, ProductCartItem } from '../../type/types';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MChip } from '../../components/marcha/m-chip/m-chip';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { MDivider } from '../../components/marcha/m-divider/m-divider';
import { MRating } from '../../components/marcha/m-rating/m-rating';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [TranslateModule, RouterModule, CurrencyPipe, DecimalPipe,
            MButton, MChip, MIcon, MDivider, MRating],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductView implements OnInit {
  private productId = signal<number>(0);
  quantity = signal(1);
  activeImageIdx = signal(0);

  private allProducts$!: Signal<Product[]>;

  product = computed<Product | undefined>(() =>
    this.allProducts$().find(p => p.id === this.productId())
  );

  allImages = computed<string[]>(() => {
    const p = this.product();
    if (!p) return [];
    return [p.mainImageUrl, ...(p.images ?? [])].filter(Boolean) as string[];
  });

  stockStatus = computed<'out' | 'low' | 'ok'>(() => {
    const p = this.product();
    if (!p) return 'ok';
    if (p.stock === 0) return 'out';
    if (p.stock <= p.lowStockThreshold) return 'low';
    return 'ok';
  });

  discountPct = computed<number | null>(() => {
    const p = this.product();
    if (!p || p.discountPrice === null || p.discountPrice >= p.price) return null;
    return Math.round((1 - p.discountPrice / p.price) * 100);
  });

  constructor(private store: Store, private route: ActivatedRoute) {
    this.allProducts$ = toSignal(
      this.store.select(selectProducts),
      { initialValue: [] as Product[] },
    );
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productId.set(id);
    if (this.allProducts$().length === 0) {
      this.store.dispatch(allProductsRequestInit());
    }
  }

  setImage(idx: number): void { this.activeImageIdx.set(idx); }

  incQty(): void {
    const p = this.product();
    if (p && this.quantity() < p.stock) this.quantity.update(q => q + 1);
  }

  decQty(): void { this.quantity.update(q => Math.max(1, q - 1)); }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect fill='%231e293b' width='200' height='200'/><text y='115' x='100' text-anchor='middle' font-size='60' fill='%23475569'>📦</text></svg>`;
  }

  addToCartFn(): void {
    const p = this.product();
    if (!p) return;
    const item: ProductCartItem = {
      id: p.id,
      name: p.name,
      price: p.discountPrice ?? p.price,
      imageUrl: p.mainImageUrl ?? '',
      quantity: this.quantity(),
      category: p.categories[0]?.name ?? '',
    };
    this.store.dispatch(addToCart({ item }));
  }
}
