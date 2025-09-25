import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { AuthService } from '../../auth/services/auth.service';
import { OrdersService } from '../../orders/services/orders.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorsPipe, ReactiveFormsModule],
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
          @for (i of items(); track i) {
            <li class="flex items-center justify-between gap-3">
              <img
                [src]="i.imageUrl"
                [alt]="i.name"
                class="w-14 h-14 rounded object-cover flex-shrink-0"
                loading="lazy"
              />
              <div class="flex-1 text-sm">
                <div class="font-medium">{{ i.name }}</div>
                <div>
                  Couleur {{ i.color | colors }} · Taille {{ i.size }} · Quantité
                  {{ i.quantity }}
                </div>
              </div>
              <div class="font-semibold text-right">
                {{ i.price * i.quantity | currency: 'EUR' }}
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
        <div class="mt-4">
          <button class="px-4 py-2 bg-black text-white rounded" type="button" (click)="toggleBox()">
            Passer au paiement
          </button>
          @if (showPrice()) {
            <form [formGroup]="cardForm" (ngSubmit)="payment()" class="mt-4 space-y-3">
              <div>
                <label for="cardNumber" class="block text-sm mb-1">Numéro de carte</label>
                <input
                  id="cardNumber"
                  formControlName="cardNumber"
                  class="w-full border rounded px-3 py-2"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label for="cardName" class="block text-sm mb-1">Nom sur la carte</label>
                <input id="cardName" formControlName="cardName" class="w-full border rounded px-3 py-2" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="expiry" class="block text-sm mb-1">Expiration (MM/AA)</label>
                  <input id="expiry" formControlName="expiry" class="w-full border rounded px-3 py-2" placeholder="MM/AA" />
                </div>
                <div>
                  <label for="cvc" class="block text-sm mb-1">CVC</label>
                  <input id="cvc" formControlName="cvc" class="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <button class="px-4 py-2 bg-black text-white rounded" type="submit" [disabled]="processing() || cardForm.invalid">
                {{ processing() ? 'Traitement…' : 'Payer' }}
              </button>
            </form>
          }
        </div>
      } @else {
        <p class="text-sm text-neutral-600">Votre panier vide.</p>
      }
    </section>
  `,
})
export class CheckoutComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private orderService = inject(OrdersService);
  private fb = inject(FormBuilder);

  user = this.authService.currentUser;
  items = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  subTotalPrice = this.cartService.totalPrice;

  delivery = signal(0);
  processing = signal(false);
  taxes = computed(() => +(this.subTotalPrice() * 0.1).toFixed(2));
  totalPrice = computed(() => +(this.subTotalPrice() + this.delivery() + this.taxes()).toFixed(2));
  success = signal(false);
  orderId = signal<string | null>(null);

  showPrice = signal(false);
  toggleBox() {
    this.showPrice.update((value) => !value);
  }

  //Live input masking/cleaning using valueChanges. We keep only digits
    //     and reformat:
    //     - cardNumber: groups of 4 (max 16 digits) -> "1234 5678 9012 3456"
    //     - expiry: "MM/AA" (auto-inserts slash)
    //     - cvc: 3 digits
  constructor() {
    this.cardForm.controls.cardNumber.valueChanges.subscribe((val) => {
      if (val === null) return;
      const digits = val.replace(/\D/g, '').slice(0, 16);
      const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      if (grouped !== val) this.cardForm.controls.cardNumber.setValue(grouped, { emitEvent: false });
    });

    this.cardForm.controls.expiry.valueChanges.subscribe((val) => {
      if (val === null) return;
      const digits = val.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
      if (formatted !== val) this.cardForm.controls.expiry.setValue(formatted, { emitEvent: false });
    });

    this.cardForm.controls.cvc.valueChanges.subscribe((val) => {
      if (val === null) return;
      const digits = val.replace(/\D/g, '').slice(0, 3);
      if (digits !== val) this.cardForm.controls.cvc.setValue(digits, { emitEvent: false });
    });
  }

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

  //Switch delivery fee between standard and express.
  setDelivery(type: 'standard' | 'express') {
    this.delivery.set(type === 'express' ? 9.9 : 0);
  }

  async payment() {
    if (this.totalItems() === 0) return;

    if (this.showPrice() && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

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

    this.orderService.addOrder(order);

    await this.cartService.clearCart();
    this.orderId.set(order.id);
    this.success.set(true);
    this.processing.set(false);
  }

  //Minimal validation with regex; combined with live masking above.
  cardForm = this.fb.nonNullable.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^(\d{4} ?){3}\d{4}$/)]],
    cardName: ['', [Validators.required, Validators.minLength(2)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
  });
}
