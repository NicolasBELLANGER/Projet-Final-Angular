import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../catalog/models/catalog.model';
import { CatalogService } from '../../catalog/services/catalog.service';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ColorsPipe],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10">
      <h1 class="text-2xl font-bold mb-6">Votre Panier</h1>

      <div *ngIf="cartItems().length; else emptyCart">
        <table class="w-full border-collapse mb-6">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Produit</th>
              <th class="text-left py-2">Prix</th>
              <th class="text-left py-2">Quantité</th>
              <th class="text-left py-2">Total</th>
              <th class="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of cartItems(); trackBy: trackByProductId" class="border-b">
              <ng-container *ngIf="getProduct(item.productId) as product">
                <td class="py-2 flex items-center gap-4">
                  <img
                    [src]="product.image1"
                    alt="{{ product.name }}"
                    class="w-16 h-16 object-cover"
                  />
                  <div>
                    <div class="font-semibold">{{ product.name }}</div>
                    <div class="text-sm text-gray-600">
                      Taille : {{ item.size }} | Couleur : {{ item.color | colors }}
                    </div>
                  </div>
                </td>
                <td class="py-2">{{ item.price | currency: 'EUR' }}</td>
                <td class="py-2">{{ item.quantity }}</td>
                <td class="py-2">{{ item.price * item.quantity | currency: 'EUR' }}</td>
                <td class="py-2">
                  <button
                    (click)="removeOne(item.productId)"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <button
                    (click)="addOne(item.productId, item.size, item.color)"
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </td>
              </ng-container>
            </tr>
          </tbody>
        </table>

        <div class="text-right">
          <p class="text-lg font-semibold">Total Articles: {{ totalItems() }}</p>
          <p class="text-lg font-bold">Total Prix: {{ totalPrice() | currency: 'EUR' }}</p>
        </div>
      </div>

      <ng-template #emptyCart>
        <p>Votre panier est vide.</p>
      </ng-template>
    </section>
  `,
})
export class CartComponent implements OnInit {
  private cart = inject(CartService);
  private catalog = inject(CatalogService);

  cartItems = this.cart.cartItems;
  totalItems = this.cart.totalItems;
  totalPrice = this.cart.totalPrice;

  products = new Map<number, Product>();

  async ngOnInit() {
    const items = this.cartItems();
    for (const item of items) {
      const product = await this.catalog.getProductById(item.productId);
      if (product) {
        this.products.set(item.productId, product);
      }
    }
  }

  getProduct(productId: number): Product | undefined {
    return this.products.get(productId);
  }

  trackByProductId(index: number, item: { productId: number }) {
    return item.productId;
  }

  async removeOne(productId: number) {
    await this.cart.deleteOneFromCart(productId);
  }

  async addOne(productId: number, size: number, color: string) {
    const product = this.products.get(productId);
    if (product) {
      await this.cart.addToCart(product, size, color, 1);
    }
  }
}
