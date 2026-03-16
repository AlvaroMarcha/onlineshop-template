import { Component, OnInit, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { MCard } from '../../components/marcha/m-card/m-card';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts } from '../../store/products/products.selector';
import { allProductsRequestInit } from '../../store/products/products.actions';
import { addToCart } from '../../store/cart/cart.actions';
import { ProductCartItem } from '../../type/types';

@Component({
  selector: 'app-init-page',
  imports: [TranslateModule, CurrencyPipe, MCard, MButton, MIcon],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitPage implements OnInit {
  // Injections
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // Store products
  private products$ = toSignal(this.store.select(selectProducts));
  
  // Featured products (primeros 6)
  featuredProducts = computed(() => {
    const products = this.products$();
    return products?.slice(0, 6) || [];
  });

  // Categorías de ejemplo (se pueden cargar dinámicamente del backend)
  readonly categories = [
    { id: 1, name: 'Electrónica', icon: 'lucide:laptop' },
    { id: 2, name: 'Moda', icon: 'lucide:shirt' },
    { id: 3, name: 'Hogar', icon: 'lucide:home' },
    { id: 4, name: 'Deportes', icon: 'lucide:dumbbell' },
    { id: 5, name: 'Libros', icon: 'lucide:book' },
    { id: 6, name: 'Juguetes', icon: 'lucide:rocket' },
  ];

  // Features del negocio
  readonly features = [
    { icon: 'lucide:truck', key: 'free_shipping' },
    { icon: 'lucide:shield-check', key: 'secure_payment' },
    { icon: 'lucide:clock', key: 'fast_delivery' },
    { icon: 'lucide:headphones', key: 'support_24_7' },
  ];

  ngOnInit(): void {
    // Cargar productos al iniciar
    this.store.dispatch(allProductsRequestInit());
  }

  // Navegación
  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  // Añadir al carrito
  addToCart(productId: number): void {
    const product = this.products$()?.find(p => p.id === productId);
    if (!product) return;

    const cartItem: ProductCartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.mainImageUrl ?? '',
      quantity: 1,
      category: product.categories[0]?.name ?? '',
    };

    this.store.dispatch(addToCart({ item: cartItem }));
  }
}
