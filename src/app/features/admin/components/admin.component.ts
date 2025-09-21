import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { CatalogService } from '../../catalog/services/catalog.service';
import { Product } from '../../catalog/models/catalog.model';
import { User } from '../../auth/models/user.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ColorsPipe],
  template: `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold mb-6">Interface d'administration</h1>

    <div class="flex space-x-4 mb-6">
      <button
        (click)="activeTab.set('users')"
        [class.bg-black]="activeTab() === 'users'"
        [class.text-white]="activeTab() === 'users'"
        class="px-4 py-2 border border-black rounded"
      >
        Utilisateurs
      </button>
      <button
        (click)="activeTab.set('products')"
        [class.bg-black]="activeTab() === 'products'"
        [class.text-white]="activeTab() === 'products'"
        class="px-4 py-2 border border-black rounded"
      >
        Produits
      </button>
    </div>
    <!-- Utilisateurs -->
    <div *ngIf="activeTab() === 'users'" class="bg-white p-6">
      <h2 class="text-xl font-semibold mb-4">Liste des utilisateurs</h2>
      <!--MOBILE-->
      <div class="md:hidden space-y-4">
        <article *ngFor="let user of users()" class="rounded-lg border p-4 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-semibold text-base">{{ user.firstname }} {{ user.lastname }}</div>
              <div class="text-sm text-gray-600 break-all">{{ user.email }}</div>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full border"
              [class.bg-gray-900]="user.role === 'admin'"
              [class.text-white]="user.role === 'admin'"
              >{{ user.role }}</span
            >
          </div>
          <div class="mt-3 flex justify-end">
            <button
              *ngIf="user.role !== 'admin'"
              (click)="deleteUser(user.id)"
              class="text-red-600 text-sm font-medium hover:underline active:scale-95"
              aria-label="Supprimer l'utilisateur"
            >
              Supprimer
            </button>
            <span *ngIf="user.role === 'admin'" class="text-gray-500 text-sm">Admin</span>
          </div>
        </article>
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
              <tr *ngFor="let user of users()">
                <td class="px-4 py-2">{{ user.firstname }}</td>
                <td class="px-4 py-2">{{ user.lastname }}</td>
                <td class="px-4 py-2">{{ user.email }}</td>
                <td class="px-4 py-2 capitalize">{{ user.role }}</td>
                <td class="px-4 py-2">
                  <button
                    *ngIf="user.role !== 'admin'"
                    (click)="deleteUser(user.id)"
                    class="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                  <span *ngIf="user.role === 'admin'" class="text-gray-500">Admin</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Produits -->
    <div *ngIf="activeTab() === 'products'" class="bg-white p-6 mt-8">
      <h2 class="text-xl font-semibold mb-4">Liste des produits</h2>
      <!--MOBILE-->
      <div class="md:hidden space-y-4">
        <article *ngFor="let p of product()" class="rounded-lg border p-4 shadow-sm">
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
              <tr *ngFor="let p of product()">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div> `,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private router = inject(Router);

  activeTab = signal<'users' | 'products'>('users');
  product = signal<Product[]>([]);
  users = signal<User[]>([]);

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    // Charger les données
    await this.loadUsers();
    await this.loadProducts();
  }

  async loadUsers() {
    try {
      const users = await firstValueFrom(this.authService.getAllUsers());
      this.users.set(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  async loadProducts() {
    try {
      const products = await this.catalogService.getAllProducts();
      this.product.set(products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await this.catalogService.deleteProduct(productId);
        await this.cartService.deleteFromCart(productId);
        await this.loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }
  getColors(colors: string[]): string {
    return colors.map((color) => new ColorsPipe().transform(color)).join(', ');
  }
}
