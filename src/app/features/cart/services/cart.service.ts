import { effect, Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../catalog/models/catalog.model';
import { AuthService } from '../../auth/services/auth.service';
import { CartItem } from '../models/cart.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  private authService = inject(AuthService);
  private userCart = (userId: number) => `userCart:${userId}`;

  readonly totalItems = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this._cartItems().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (!user) {
        this._cartItems.set([]);
        return;
      }
      const raw = localStorage.getItem(this.userCart(user.id));
      this._cartItems.set(raw ? (JSON.parse(raw) as CartItem[]) : []);
    });

    effect(() => {
      const user = this.authService.currentUser();
      if (!user) return;
      localStorage.setItem(this.userCart(user.id), JSON.stringify(this._cartItems()));
    });
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
      const colorIndex = product.colors.findIndex((c) => c === color);
      const imageUrl = colorIndex === 1 && product.image2 ? product.image2 : product.image1;
      this._cartItems.set([
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          color,
          quantity,
          imageUrl,
        },
      ]);
    }
  }

  async deleteOneFromCart(productId: number, size: number, color: string): Promise<void> {
    await this.delay(200);
    const items = this._cartItems();
    const index = items.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color,
    );
    if (index > -1) {
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
        this._cartItems.set([...items]);
      } else {
        items.splice(index, 1);
        this._cartItems.set([...items]);
      }
    }
  }

  async deleteFromCart(productId: number): Promise<void> {
    await this.delay(200);
    this._cartItems.set(
      this._cartItems().filter(
        (item) => !(item.productId === productId),
      ),
    );
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
