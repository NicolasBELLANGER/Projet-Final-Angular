import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { CatalogService } from '../../catalog/services/catalog.service';
import { CreateProductRequest, Product } from '../../catalog/models/catalog.model';
import { User } from '../../auth/models/user.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { CartService } from '../../cart/services/cart.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { OrdersService } from '../../orders/services/orders.service';
import { Order } from '../../orders/models/orders.models';

const csvHasNumber: ValidatorFn = (ctrl: AbstractControl): ValidationErrors | null =>
  String(ctrl.value ?? '')
    .split(/[,\s;]+/)
    .map((s) => parseFloat(s.replace(',', '.').trim()))
    .some((n) => Number.isFinite(n))
    ? null
    : { csvHasNumber: true };

const parseSizesCsv = (csv: string): number[] =>
  (csv ?? '')
    .split(/[,\s;]+/)
    .map((s) => parseFloat(s.replace(',', '.').trim()))
    .filter((n) => Number.isFinite(n));

const parseColorsCsv = (csv: string): string[] =>
  (csv ?? '')
    .split(/[,\s;]+/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.charAt(0).toLocaleUpperCase('fr-FR') + c.slice(1).toLocaleLowerCase('fr-FR'));

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ColorsPipe, ReactiveFormsModule],
  template: `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold mb-6">Interface d'administration</h1>
    <div class="flex flex-wrap sm:justify-start gap-2 sm:gap-4 mb-6">
      <button
        (click)="activeTab.set('users')"
        [class.bg-black]="activeTab() === 'users'"
        [class.text-white]="activeTab() === 'users'"
        class="text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 border border-black rounded"
      >
        Utilisateurs
      </button>
      <button
        (click)="activeTab.set('products')"
        [class.bg-black]="activeTab() === 'products'"
        [class.text-white]="activeTab() === 'products'"
        class="text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 border border-black rounded"
      >
        Produits
      </button>
      <button
        (click)="activeTab.set('orders')"
        [class.bg-black]="activeTab() === 'orders'"
        [class.text-white]="activeTab() === 'orders'"
        class="text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 border border-black rounded"
      >
        Commandes
      </button>
      <button
        (click)="activeTab.set('create')"
        [class.bg-black]="activeTab() === 'create'"
        [class.text-white]="activeTab() === 'create'"
        class="text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 border border-black rounded"
      >
        Créer un produit
      </button>
    </div>
    <!-- Utilisateurs -->
    @if (activeTab() === 'users') {
      <div class="bg-white p-6">
        <h2 class="text-xl font-semibold mb-4">Liste des utilisateurs</h2>
        <!--MOBILE-->
        <div class="md:hidden space-y-4">
          @for (u of users(); track u.id) {
            <article class="rounded-lg border p-4 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold text-base">
                    {{ u.firstname }} {{ u.lastname }}
                  </div>
                  <div class="text-sm text-gray-600 break-all">{{ u.email }}</div>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full border"
                  [class.bg-gray-900]="u.role === 'admin'"
                  [class.text-white]="u.role === 'admin'"
                  >{{ u.role }}</span
                >
              </div>
              <div class="mt-3 flex justify-end">
                @if (u.role !== 'admin') {
                  <button
                    (click)="deleteUser(u.id)"
                    class="text-red-600 text-sm font-medium hover:underline active:scale-95"
                    aria-label="Supprimer l'utilisateur"
                  >
                    Supprimer
                  </button>
                }
                @if (u.role === 'admin') {
                  <span class="text-gray-500 text-sm">Admin</span>
                }
              </div>
            </article>
          }
        </div>
        <!--DESKTOP-->
        <div class="hidden md:block">
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full table-auto border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-left px-4 py-2">Prénom</th>
                  <th class="text-left px-4 py-2">Nom</th>
                  <th class="text-left px-4 py-2">Email</th>
                  <th class="text-left px-4 py-2">Rôle</th>
                  <th class="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (u of users(); track u.id) {
                  <tr>
                    <td class="px-4 py-2">{{ u.firstname }}</td>
                    <td class="px-4 py-2">{{ u.lastname }}</td>
                    <td class="px-4 py-2">{{ u.email }}</td>
                    <td class="px-4 py-2 capitalize">{{ u.role }}</td>
                    <td class="px-4 py-2">
                      @if (u.role !== 'admin') {
                        <button (click)="deleteUser(u.id)" class="text-red-600 hover:underline">
                          Supprimer
                        </button>
                      }
                      @if (u.role === 'admin') {
                        <span class="text-gray-500">Admin</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }
    <!-- Produits -->
    @if (activeTab() === 'products') {
      <div class="bg-white p-6 mt-8">
        <h2 class="text-xl font-semibold mb-4">Liste des produits</h2>
        <!--MOBILE-->
        <div class="md:hidden space-y-4">
          @for (p of product(); track p.id) {
            <article class="rounded-lg border p-4 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold">{{ p.name }}</div>
                  <div class="text-sm text-gray-600">Marque : {{ p.brand }}</div>
                  <div class="mt-1 text-sm">
                    Prix : <span class="font-medium">{{ p.price | currency: 'EUR' }}</span>
                  </div>
                  <div class="text-sm text-gray-700">Pointures : {{ p.sizes.join(', ') }}</div>
                  <div class="text-sm text-gray-700">Couleurs : {{ getColors(p.colors) }}</div>
                </div>
                <button
                  (click)="deleteProducts(p.id)"
                  class="text-red-600 text-sm font-medium hover:underline active:scale-95"
                  aria-label="Supprimer le produit"
                >
                  Supprimer
                </button>
              </div>
            </article>
          }
        </div>
        <!--DESKTOP-->
        <div class="hidden md:block bg-white p-4 md:p-6">
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full table-auto border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-left px-4 py-2">Nom</th>
                  <th class="text-left px-4 py-2">Marque</th>
                  <th class="text-left px-4 py-2">Prix</th>
                  <th class="text-left px-4 py-2">Pointures</th>
                  <th class="text-left px-4 py-2">Couleurs</th>
                  <th class="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (p of product(); track p.id) {
                  <tr>
                    <td class="px-4 py-2">{{ p.name }}</td>
                    <td class="px-4 py-2">{{ p.brand }}</td>
                    <td class="px-4 py-2">{{ p.price | currency: 'EUR' }}</td>
                    <td class="px-4 py-2">{{ p.sizes.join(', ') }}</td>
                    <td class="px-4 py-2">{{ getColors(p.colors) }}</td>
                    <td class="px-4 py-2">
                      <button (click)="deleteProducts(p.id)" class="text-red-600 hover:underline">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }
    <!-- Commandes -->
    @if (activeTab() === 'orders') {
      <div class="bg-white p-6 mt-8">
        <h2 class="text-xl font-semibold mb-4">Liste des commandes</h2>
        <!--MOBILE-->
        <div class="md:hidden space-y-4">
          @for (o of order(); track o.id) {
            <li class="border rounded p-4 list-none">
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
        </div>
        <!--DESKTOP-->
        <div class="hidden md:block bg-white p-4 md:p-6">
          <div class="overflow-x-auto -mx-4 md:mx-0">
            @for (o of order(); track o.id) {
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
          </div>
        </div>
      </div>
    }
    <!--ADDProduct-->
    @if (activeTab() === 'create') {
      <div class="bg-white p-6">
        <h2 class="text-xl font-semibold mb-4">Créer un produit</h2>
        <form [formGroup]="createForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <input
            formControlName="name"
            placeholder="Nom"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('name')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('name') }}</p>
          }
          <input
            formControlName="brand"
            placeholder="Marque"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('brand')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('brand') }}</p>
          }

          <input
            type="number"
            step="0.01"
            min="0"
            formControlName="price"
            placeholder="Prix (€)"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('price')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('price') }}</p>
          }

          <input
            formControlName="sizesCsv"
            placeholder="Pointures (ex: 36, 37.5, 38)"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('sizesCsv')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('sizesCsv') }}</p>
          }

          <input
            formControlName="colorsCsv"
            placeholder="Couleurs (ex: black, white)"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('colorsCsv')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('colorsCsv') }}</p>
          }

          <input
            type="url"
            formControlName="image1"
            placeholder="Image 1 (URL)"
            class="w-full border rounded-lg px-3 py-2"
          />
          @if (isFieldInvalid('image1')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('image1') }}</p>
          }

          <input
            type="url"
            formControlName="image2"
            placeholder="Image 2 (URL, optionnel)"
            class="w-full border rounded-lg px-3 py-2"
          />

          <textarea
            rows="4"
            formControlName="description"
            placeholder="Description"
            class="w-full border rounded-lg px-3 py-2"
          ></textarea>
          @if (isFieldInvalid('description')) {
            <p class="mt-1 text-sm text-red-600">{{ getFieldError('description') }}</p>
          }

          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-white bg-black disabled:opacity-50"
            [disabled]="createForm.invalid || creating()"
          >
            {{ creating() ? 'Création…' : 'Créer' }}
          </button>
          @if (
            createForm.controls.sizesCsv.touched &&
            createForm.controls.sizesCsv.hasError('csvHasNumber')
          ) {
            <p class="text-sm text-red-600 mt-1">Indique au moins une pointure valide.</p>
          }
        </form>
      </div>
    }
  </div>`,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private orderService = inject(OrdersService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    price: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    sizesCsv: ['', [Validators.required, csvHasNumber]],
    colorsCsv: ['', [Validators.required]],
    image1: ['', [Validators.required]],
    image2: this.fb.control<string | null>(null),
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  activeTab = signal<'users' | 'products' | 'orders' | 'create'>('users');
  product = signal<Product[]>([]);
  users = signal<User[]>([]);
  order = signal<Order[]>([]);
  creating = signal(false);
  editing = signal(false);

  async ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    await this.loadUsers();
    await this.loadProducts();
    await this.loadOrders();
  }

  async loadUsers() {
    const users = await firstValueFrom(this.authService.getAllUsers());
    this.users.set(users);
  }

  async loadProducts() {
    const products = await this.catalogService.getAllProducts();
    this.product.set(products);
  }

  async loadOrders() {
    const orders = await this.orderService.getAllOrders();
    this.order.set(orders);
  }

  async deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await this.authService.deleteUser(userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  async deleteProducts(productId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await this.catalogService.deleteProduct(productId);
        await this.cartService.deleteFromCart(productId);
        await this.loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.creating.set(true);
    try {
      const v = this.createForm.getRawValue();
      const payload: CreateProductRequest = {
        name: v.name.trim(),
        brand: v.brand.trim(),
        price: Number(v.price),
        sizes: parseSizesCsv(v.sizesCsv),
        colors: parseColorsCsv(v.colorsCsv),
        image1: v.image1.trim(),
        image2: v.image2?.trim() || undefined,
        description: v.description.trim(),
      };
      await this.catalogService.createProduct(payload);
      await this.loadProducts();
      this.createForm.reset();
      this.activeTab.set('products');
    } finally {
      this.creating.set(false);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const c = this.createForm.get(fieldName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getFieldError(fieldName: string): string {
    const c = this.createForm.get(fieldName);
    if (!c || !c.errors) return '';

    if (c.errors['required']) return 'Ce champ est requis.';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} caractères.`;
    if (c.errors['min']) return `La valeur doit être ≥ ${c.errors['min'].min}.`;
    if (c.errors['csvHasNumber']) return 'Indique au moins une pointure valide.';
    return 'Valeur invalide.';
  }

  getColors(colors: string[]): string {
    return colors.map((color) => new ColorsPipe().transform(color)).join(', ');
  }
}
