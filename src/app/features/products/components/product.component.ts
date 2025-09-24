import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogService } from '../../catalog/services/catalog.service';
import { Product } from '../../catalog/models/catalog.model';
import { CartService } from '../../cart/services/cart.service';
import { ColorHexPipe } from '../../../shared/pipes/color-hex.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorHexPipe, FormsModule],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="bg-neutral-100 aspect-[3/3] overflow-hidden">
          <img
            [src]="mainImage"
            [alt]="product?.name || 'Produit'"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">{{ product?.name }}</h1>
          <p class="mt-1 text-neutral-600">{{ product?.brand }}</p>
          <div class="mt-2 text-2xl font-bold">{{ product?.price | currency: 'EUR' }}</div>

          <div class="mt-6">
            <p class="text-sm text-neutral-700">{{ product?.description }}</p>
          </div>

          <div class="mt-6">
            <label for="size" class="block text-sm font-medium mb-2">Pointure</label>
            <select
              id="size"
              class="w-48 border px-3 py-2 text-sm bg-white"
              [(ngModel)]="selectedSize"
            >
              @for(s of product?.sizes; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </div>

          <div class="flex gap-2 mt-4">
            @for(c of product?.colors; let i = $index; track c) {
              <button
                class="w-6 h-6 rounded-full border"
                [style.backgroundColor]="c | colorHex"
                [title]="c"
                [class.border-4]="i === selectedColorIndex"
                (click)="selectColor(c, i)"
              ></button>
            }
          </div>

          <div class="mt-8">
            <button
              type="button"
              class="px-5 py-3 bg-black text-white font-semibold hover:opacity-90"
              (click)="addToCart()"
              [disabled]="!selectedSize || !selectedColor"
            >
              Ajouter au panier
            </button>
            @if(!currentUser()) {
              <div class="text-red-500 text-sm mt-2">
                Vous devez être connecté pour ajouter un produit au panier.
              </div>
            }
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
  private readonly auth = inject(AuthService);

  currentUser = this.auth._currentUser;

  product?: Product;
  selectedSize?: number;
  selectedColor?: string;
  selectedColorIndex?: number;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalog.getProductById(id).then((p) => (this.product = p || undefined));
    if (this.product) {
      this.selectedSize = this.product.sizes[0];
      this.selectedColor = this.product.colors[0];
      this.selectedColorIndex = 0;
    }
  }

  get mainImage(): string | undefined {
    const product = this.product;
    if (!product) {
      return undefined;
    }
    return this.selectedColorIndex === 1 && product.image2 ? product.image2 : product.image1;
  }

  selectColor(color: string, index: number) {
    this.selectedColor = color;
    this.selectedColorIndex = index;
  }

  addToCart() {
    if (this.product && this.selectedSize && this.selectedColor) {
      this.cart.addToCart(this.product, this.selectedSize, this.selectedColor, 1);
    }
  }
}
