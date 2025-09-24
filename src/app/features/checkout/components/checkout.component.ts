import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { AuthService } from '../../auth/services/auth.service';
import { OrdersService } from '../../orders/services/orders.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorsPipe],
  template: `
    <section class="w-full md:w-[60%] max-w-3/4 min-h-[70vh] mx-auto p-4">
      @if (success()) {
        <div class="text-center space-y-4">
          <h2 class="text-xl font-semibold text-green-600">Commande confirmée !</h2>
          <p class="text-sm">
            ID de commande : <code class="text-gray-700">{{ orderId() }}</code>
          </p>
          <button routerLink="/orders" class="px-4 py-2 bg-black text-white rounded" type="button">
            Voir mes commandes
          </button>
        </div>
      } @else if (totalItems() > 0) {
        <h1 class="text-xl font-semibold mb-4">Paiement</h1>
        <div class="mb-6 text-sm">
          @if (user(); as u) {
            <p class="mb-1 font-medium">La livraison sera effectuée à l'adresse suivante :</p>
            <p>{{ u.address }}, {{ u.postcode }} {{ u.city }}</p>
          } @else {
            <p class="text-neutral-600">Connectez‑vous pour voir votre adresse.</p>
          }
        </div>
        <ul class="space-y-3 mb-6">
          @for (item of items(); track item) {
            <li class="flex items-center justify-between gap-3">
              <img
                [src]="item.imageUrl"
                [alt]="item.name"
                class="w-14 h-14 rounded object-cover flex-shrink-0"
                loading="lazy"
              />
              <div class="flex-1 text-sm">
                <div class="font-medium">{{ item.name }}</div>
                <div>
                  Couleur {{ item.color | colors }} · Taille {{ item.size }} · Quantité
                  {{ item.quantity }}
                </div>
              </div>
              <div class="font-semibold text-right">
                {{ item.price * item.quantity | currency: 'EUR' }}
              </div>
            </li>
          }
        </ul>
        <div class="mb-4">
          <p class="mb-2 text-sm font-medium">Livraison</p>
          <label class="mr-4 text-sm">
            <input
              type="radio"
              name="ship"
              [checked]="delivery() === 0"
              (change)="setDelivery('standard')"
            />
            Standard (0€)
          </label>
          <label class="text-sm">
            <input
              type="radio"
              name="ship"
              [checked]="delivery() === 9.9"
              (change)="setDelivery('express')"
            />
            Express (+9,90€)
          </label>
        </div>
        <p class="mt-2 mb-5 text-sm text-gray-600">
          Livraison estimée : <strong>{{ estimatedDeliveryDate() }}</strong>
        </p>
        <div class="text-sm space-y-1 mb-6">
          <div class="flex justify-between">
            <span>Sous‑total</span><span>{{ subTotalPrice() | currency: 'EUR' }}</span>
          </div>
          <div class="flex justify-between">
            <span>Livraison</span><span>{{ delivery() | currency: 'EUR' }}</span>
          </div>
          <div class="flex justify-between">
            <span>Taxes</span><span>{{ taxes() | currency: 'EUR' }}</span>
          </div>
          <div class="flex justify-between border-t pt-2 font-semibold">
            <span>Total</span><span>{{ totalPrice() | currency: 'EUR' }}</span>
          </div>
        </div>
        <button
          class="px-4 py-2 bg-black text-white rounded"
          routerLink="/order"
          (click)="payment()"
          [disabled]="processing()"
        >
          {{ processing() ? 'Traitement…' : 'Payer' }}
        </button>
      } @else {
        <p class="text-sm text-neutral-600">Votre panier vide.</p>
      }
    </section>
  `,
})
export class CheckoutComponent {
  private users = inject(AuthService);
  private cart = inject(CartService);
  private orders = inject(OrdersService);

  user = this.users.currentUser$;
  items = this.cart.cartItems;
  totalItems = this.cart.totalItems;
  subTotalPrice = this.cart.totalPrice;

  delivery = signal(0);
  processing = signal(false);
  taxes = computed(() => +(this.subTotalPrice() * 0.1).toFixed(2));
  totalPrice = computed(() => +(this.subTotalPrice() + this.delivery() + this.taxes()).toFixed(2));
  success = signal(false);
  orderId = signal<string | null>(null);

  estimatedDeliveryDate = computed(() => {
    const now = new Date();
    const daysToAdd = this.delivery() === 9.9 ? 2 : 7;

    const estimated = new Date(now);
    estimated.setDate(now.getDate() + daysToAdd);

    return estimated.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  setDelivery(type: 'standard' | 'express') {
    this.delivery.set(type === 'express' ? 9.9 : 0);
  }

  async payment() {
    if (this.totalItems() === 0) return;
    this.processing.set(true);

    const user = this.user();
    if (!user) {
      this.processing.set(false);
      return;
    }

    const order = {
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),

      userId: user.id,
      client: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },

      deliveryTo: {
        address: user.address,
        city: user.city,
        postcode: user.postcode,
      },

      items: this.items(),
      pricing: {
        subTotalPrice: this.subTotalPrice(),
        delivery: this.delivery(),
        taxes: this.taxes(),
        totalPrice: this.totalPrice(),
      },
    };

    this.orders.addOrder(order);

    await this.cart.clearCart();
    this.orderId.set(order.id);
    this.success.set(true);
    this.processing.set(false);
  }
}
