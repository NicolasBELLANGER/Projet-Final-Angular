import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorsPipe],
  template: `
    <section class="w-full max-w-3/4 min-h-[70vh] mx-auto p-4">
      <h1 class="text-xl font-semibold mb-4">Paiement</h1>
      @if (totalItems() > 0) {
        <ul class="space-y-3 mb-6">
          @for (item of items(); track item) {
            <li class="flex justify-between items-start">
              <div class="text-sm">
                <div class="font-medium">{{ item.name }}</div>
                <div>Couleur {{ item.color | colors }} · Taille {{ item.size }} · Quantité {{ item.quantity }}</div>
              </div>
              <div class="font-semibold">
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
          (click)="payment()"
          [disabled]="processing()"
        >
          {{ processing() ? 'Traitement…' : 'Payer' }}
        </button>
      } @else {
        <p class="text-sm text-neutral-600">Panier vide.</p>
      }
    </section>
  `,
})
export class CheckoutComponent {
  private cart = inject(CartService);
  items = this.cart.cartItems;
  totalItems = this.cart.totalItems;
  subTotalPrice = this.cart.totalPrice;

  delivery = signal(0);
  processing = signal(false);
  taxes = computed(() => +(this.subTotalPrice() * 0.2).toFixed(2));
  totalPrice = computed(() => +(this.subTotalPrice() + this.delivery() + this.taxes()).toFixed(2));

  setDelivery(type: 'standard' | 'express') {
    this.delivery.set(type === 'express' ? 9.9 : 0);
  }

  async payment() {
    if (this.totalItems() === 0) return;
    this.processing.set(true);

    const order = {
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      items: this.items(),
      pricing: {
        subtotal: this.subTotalPrice(),
        shipping: this.delivery(),
        taxes: this.taxes(),
        total: this.totalPrice(),
      },
    };
    const saved = JSON.parse(localStorage.getItem('orders') || '[]');
    saved.push(order);
    localStorage.setItem('orders', JSON.stringify(saved));

    await this.cart.clearCart();
    this.processing.set(false);
    alert('Commande confirmé {{order.id}}');
  }
}
