import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/orders.models';
import { CommonModule } from '@angular/common';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ColorsPipe],
  template: `
    <section class="max-w-4xl mx-auto p-4 min-h-[70vh]">
      <h1 class="text-xl font-bold mb-4">Mes commandes</h1>
      @if (orders.length > 0) {
        <ul class="space-y-6">
          @for (order of orders; track order.id) {
            <li class="border rounded p-4">
              <div class="font-semibold mb-1">Commande #{{ order.id }}</div>
              <div class="text-sm text-gray-600 mb-2">
                Passée le {{ order.createdAt | date: 'mediumDate' }} — Total :
                <strong>{{ order.pricing.totalPrice | currency: 'EUR' }}</strong>
              </div>
              <div class="text-sm mb-4">
                Livraison : {{ order.deliveryTo.address }}, {{ order.deliveryTo.postcode }}
                {{ order.deliveryTo.city }}
              </div>
              <ul class="space-y-2 text-sm">
                @for (item of order.items; track item.productId) {
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
            </li>
          }
        </ul>
      } @else {
        <p class="text-sm text-neutral-600">Aucune commande trouvée.</p>
      }
    </section>
  `,
})
export class OrdersComponent implements OnInit {
  private auth = inject(AuthService);
  private order = inject(OrdersService);

  orders: Order[] = [];
  user = this.auth._currentUser;

  ngOnInit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.orders = this.order.getAllOrdersByUserId(currentUser.id);
    }
  }
}
