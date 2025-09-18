import { effect, Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../catalog/models/catalog.model';
import { AuthService } from '../../auth/services/auth.service';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  size: number;
  color: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  readonly totalItems = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this._cartItems().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  private userId: number | null = null;

  constructor() {
    const auth = inject(AuthService);

    effect(() => {
      const user = auth.currentUser$();
      const newUserId = user?.id ?? null;
      if (this.userId !== newUserId) {
        this.userId = newUserId;
        this.loadCartForUser(this.userId);
      }
    });

    effect(() => {
      if (this.userId !== null) {
        const allCarts = this.getAllCartsFromStorage();
        allCarts[this.userId] = this._cartItems();
        localStorage.setItem('carts', JSON.stringify(allCarts));
      }
    });
  }

  private getAllCartsFromStorage(): Record<number, CartItem[]> {
    const saved = localStorage.getItem('carts');
    return saved ? JSON.parse(saved) : {};
  }

  private loadCartForUser(userId: number | null) {
    if (!userId) {
      this._cartItems.set([]);
      return;
    }

    const allCarts = this.getAllCartsFromStorage();
    this._cartItems.set(allCarts[userId] || []);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async addToCart(product: Product, size: number, color: string, quantity = 1): Promise<void> {
    await this.delay(200);
    const items = this._cartItems();
    const index = items.findIndex(
      (item) => item.productId === product.id && item.size === size && item.color === color,
    );
    if (index > -1) {
      items[index].quantity += quantity;
      this._cartItems.set([...items]);
    } else {
      this._cartItems.set([
        ...items,
        { productId: product.id, name: product.name, price: product.price, size, color, quantity },
      ]);
    }
  }

  async deleteOneFromCart(productId: number): Promise<void> {
    await this.delay(200);
    const items = this._cartItems();
    const index = items.findIndex((item) => item.productId === productId);
    if (index > -1) {
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
        this._cartItems.set([...items]);
      } else {
        this._cartItems.set(items.filter((item) => item.productId !== productId));
      }
    }
  }

  async deleteFromCart(productId: number): Promise<void> {
    await this.delay(200);
    this._cartItems.set(this._cartItems().filter((item) => item.productId !== productId));
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
