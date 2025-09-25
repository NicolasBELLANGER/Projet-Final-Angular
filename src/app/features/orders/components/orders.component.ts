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
          @for (o of orders; track o.id) {
            <li class="border rounded p-4">
              <div class="font-semibold mb-1">Commande #{{ o.id }}</div>
              <div class="text-sm text-gray-600 mb-2">
                Passée le {{ o.createdAt | date: 'mediumDate' }} — Total :
                <strong>{{ o.pricing.totalPrice | currency: 'EUR' }}</strong>
              </div>
              <div class="text-sm mb-4">
                Livraison : {{ o.deliveryTo.address }}, {{ o.deliveryTo.postcode }}
                {{ o.deliveryTo.city }}
              </div>
              <ul class="space-y-2 text-sm">
                @for (i of o.items; track i.productId) {
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
  private authService = inject(AuthService);
  private orderService = inject(OrdersService);

  orders: Order[] = [];
  user = this.authService.currentUser;

  ngOnInit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.orders = this.orderService.getAllOrdersByUserId(currentUser.id);
    }
  }
}
