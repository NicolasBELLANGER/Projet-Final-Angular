import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10">
      <h1 class="text-2xl font-bold mb-6">Votre Panier</h1>
      <div *ngIf="cartItems().length; else emptyCart">
        <table class="w-full border-collapse mb-6">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Produit</th>
              <th class="text-left py-2">Prix Unitaire</th>
              <th class="text-left py-2">Quantité</th>
              <th class="text-left py-2">Total</th>
              <th class="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of cartItems(); trackBy: trackByProductId" class="border-b">
              <td class="py-2 flex items-center gap-4">
                <img [src]="item.product.image1" alt="{{ item.product.name }}" class="w-16 h-16 object-cover" />
                <span>{{ item.product.name }}</span>
              </td>
              <td class="py-2">{{ item.product.price | currency:'EUR' }}</td>
              <td class="py-2">{{ item.quantity }}</td>
              <td class="py-2">{{ (item.product.price * item.quantity) | currency:'EUR' }}</td>
              <td class="py-2">
                <button
                  (click)="removeOne(item.product.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <button
                  (click)="addOne(item.product.id)"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-right">
          <p class="text-lg font-semibold">Total Articles: {{ totalItems() }}</p>
          <p class="text-lg font-bold">Total Prix: {{ totalPrice() | currency:'EUR' }}</p>
        </div>
      </div>
      <ng-template #emptyCart>
        <p>Votre panier est vide.</p>
      </ng-template>
    </section>
  `,
})
export class CartComponent {
  private cart = inject(CartService);

  cartItems = this.cart.cartItems;
  totalItems = this.cart.totalItems;
  totalPrice = this.cart.totalPrice;

  trackByProductId(index: number, item: { product: { id: number } }) {
    return item.product.id;
  }

  async removeOne(productId: number) {
    await this.cart.deleteOneFromCart(productId);
  }

  async addOne(productId: number) {
    const item = this.cartItems().find((ci) => ci.product.id === productId);
    if (item) {
      await this.cart.addToCart(item.product, 1);
    }
  }
}
