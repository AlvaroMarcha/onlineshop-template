import { Component, Signal } from '@angular/core';
import { ProductCartItem } from '../../type/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCartItems } from '../../store/cart/cart.selector';
import { removeFromCart, updateQuantity } from '../../store/cart/cart.actions';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, InputNumberModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  products$: Signal<ProductCartItem[] | undefined>;

  constructor(private store: Store) {
    this.products$ = toSignal(this.store.select(selectCartItems));
  }

  onQuantityChange(id: number, newValue: number | string | null) {
    const quantity = Number(newValue) || 0;
    this.store.dispatch(updateQuantity({ id, quantity }));
  }

  removeCartItem(id: number) {
    this.store.dispatch(removeFromCart({ id }));
  }
}
