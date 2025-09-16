import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogService } from '../../catalog/services/catalog.service';
import { Product } from '../../catalog/models/catalog.model';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorsPipe],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="bg-neutral-100 aspect-[3/3] overflow-hidden">
          <img
            [src]="product?.image1"
            [alt]="product?.name || 'Produit'"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">{{ product?.name }}</h1>
          <p class="mt-1 text-neutral-600">{{ product?.brand }}</p>
          <div class="mt-2 text-2xl font-bold">{{ product?.price | currency:'EUR' }}</div>

          <div class="mt-6">
            <p class="text-sm text-neutral-700">{{ product?.description }}</p>
          </div>

          <div class="mt-6">
            <label for="size" class="block text-sm font-medium mb-2">Pointure</label>
            <select id="size" class="w-48 border px-3 py-2 text-sm bg-white">
              <option *ngFor="let s of product?.sizes" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div class="mt-6" *ngIf="product?.colors?.length">
            <label for="color" class="block text-sm font-medium mb-2">Couleur</label>
            <select id="color" class="w-48 border px-3 py-2 text-sm bg-white">
              <option *ngFor="let c of product?.colors" [value]="c">{{ c | colors }}</option>
            </select>
          </div>

          <div class="mt-8">
            <button type="button" class="px-5 py-3 bg-black text-white font-semibold hover:opacity-90" (click)="addToCart()">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProductComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);

  product?: Product;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalog.getProductById(id).then(p => (this.product = p || undefined));
  }

  addToCart() {
  if (this.product) {
    this.cart.addToCart(this.product);
  }
}
}
