import { effect, Injectable, signal, computed } from '@angular/core';
import { Product } from '../../catalog/models/catalog.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  readonly totalItems = computed(() => this._cartItems().reduce((total, item) => total + item.quantity, 0));
  readonly totalPrice = computed(() =>
    this._cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    if (saved) {
      this._cartItems.set(JSON.parse(saved));
    }
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._cartItems()));
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async addToCart(product: Product, quantity = 1): Promise<void> {
    await this.delay(200);
    const items = this._cartItems();
    const index = items.findIndex((item) => item.product.id === product.id);
    if (index > -1) {
      items[index].quantity += quantity;
      this._cartItems.set([...items]);
    } else {
      this._cartItems.set([...items, { product, quantity }]);
    }
  }

  async deleteOneFromCart(productId: number): Promise<void> {
    await this.delay(200);
    const items = this._cartItems();
    const index = items.findIndex((item) => item.product.id === productId);
    if (index > -1) {
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
        this._cartItems.set([...items]);
      } else {
        this._cartItems.set(items.filter((item) => item.product.id !== productId));
      }
    }
  }

  async deleteFromCart(productId: number): Promise<void> {
    await this.delay(200);
    this._cartItems.set(this._cartItems().filter((item) => item.product.id !== productId));
  }

  async getAllCartItems(): Promise<CartItem[]> {
    await this.delay(100);
    return this._cartItems();
  }

  async clearCart(): Promise<void> {
    await this.delay(100);
    this._cartItems.set([]);
  }
}
