import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../catalog/models/catalog.model';
import { CatalogService } from '../../catalog/services/catalog.service';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ColorsPipe, RouterModule],
  template: `
    <section class="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
      <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Votre Panier</h1>
      @if (cartItems().length) {
        <ng-container>
          <!--MOBILE-->
          <div class="md:hidden space-y-4">
            @for (item of cartItems(); track item.productId) {
              <div class="rounded-lg border p-4 flex gap-4">
                @if (getProduct(item.productId)) {
                  <ng-container>
                    <img
                      [src]="item.imageUrl"
                      [alt]="item.name"
                      loading="lazy"
                      class="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover flex-shrink-0"
                    />
                    <div class="flex-1">
                      <div class="font-semibold">{{ item.name }}</div>
                      <div class="text-sm text-gray-600">
                        Taille : {{ item.size }} • Couleur : {{ item.color | colors }}
                      </div>

                      <div class="mt-2 flex items-center justify-between">
                        <div class="text-sm font-medium">
                          {{ item.price | currency: 'EUR' }}
                        </div>

                        <div class="flex items-center gap-2">
                          <button
                            (click)="removeOne(item.productId, item.size, item.color)"
                            class="h-9 w-9 rounded-full bg-red-500 text-white grid place-items-center active:scale-95"
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>

                          <span class="w-8 text-center">{{ item.quantity }}</span>

                          <button
                            (click)="addOne(item.productId, item.size, item.color)"
                            class="h-9 w-9 rounded-full bg-green-600 text-white grid place-items-center active:scale-95"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div class="mt-1 text-right text-sm font-semibold">
                        Total : {{ item.price * item.quantity | currency: 'EUR' }}
                      </div>
                    </div>
                  </ng-container>
                } @else {
                  <div class="text-red-600">Produit introuvable</div>
                }
              </div>
            }
          </div>
          <!--DESKTOP-->
          <div class="hidden md:block">
            <div class="overflow-x-auto -mx-4 md:mx-0">
              <table class="min-w-[800px] w-full border-collapse mb-6">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-4">Produit</th>
                    <th class="text-left py-2 px-4">Prix</th>
                    <th class="text-left py-2 px-4">Quantité</th>
                    <th class="text-left py-2 px-4">Total</th>
                    <th class="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of cartItems(); track item.productId) {
                    <tr class="border-b">
                      @if (getProduct(item.productId); as product) {
                        <ng-container>
                          <td class="py-3 px-4">
                            <div class="flex items-center gap-4">
                              <img
                                [src]="item.imageUrl"
                                [alt]="item.name"
                                loading="lazy"
                                class="w-16 h-16 rounded object-cover"
                              />
                              <div>
                                <div class="font-semibold">{{ item.name }}</div>
                                <div class="text-sm text-gray-600">
                                  Taille : {{ item.size }} • Couleur : {{ item.color | colors }}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="py-3 px-4">{{ item.price | currency: 'EUR' }}</td>
                          <td class="py-3 px-4">{{ item.quantity }}</td>
                          <td class="py-3 px-4">
                            {{ item.price * item.quantity | currency: 'EUR' }}
                          </td>
                          <td class="py-3 px-4">
                            <div class="flex gap-2">
                              <button
                                (click)="removeOne(item.productId, item.size, item.color)"
                                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                −
                              </button>
                              <button
                                (click)="addOne(item.productId, item.size, item.color)"
                                class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </ng-container>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          <!-- Totaux -->
          <div class="mt-6 md:text-right flex flex-col items-end">
            <p class="text-base md:text-lg font-semibold">Total Articles : {{ totalItems() }}</p>
            <p class="text-lg md:text-xl font-bold">
              Total Prix : {{ totalPrice() | currency: 'EUR' }}
            </p>
          </div>
          <div class="flex justify-end mt-5">
            <button
              class="px-4 py-2 bg-black text-white rounded"
              routerLink="/checkout"
              type="button"
            >
              Passer au paiement
            </button>
          </div>
        </ng-container>
      } @else {
        <p>Votre panier est vide.</p>
      }
    </section>
  `,
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private catalogService = inject(CatalogService);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  products = new Map<number, Product>();

  async ngOnInit() {
    const items = this.cartItems();
    for (const item of items) {
      const product = await this.catalogService.getProductById(item.productId);
      if (product) {
        this.products.set(item.productId, product);
      }
    }
  }

  getProduct(productId: number): Product | undefined {
    return this.products.get(productId);
  }

  async removeOne(productId: number, size: number, color: string) {
    await this.cartService.deleteOneFromCart(productId, size, color);
  }

  async addOne(productId: number, size: number, color: string) {
    const product = this.products.get(productId);
    if (product) {
      await this.cartService.addToCart(product, size, color, 1);
    }
  }
}
