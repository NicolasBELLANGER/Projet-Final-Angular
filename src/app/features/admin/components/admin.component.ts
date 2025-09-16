import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CatalogService } from '../../catalog/services/catalog.service';
import { Product } from '../../catalog/models/catalog.model';
import { User } from '../../auth/models/user.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: '<div>Page Admin</div>',
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private catalogService = inject(CatalogService);
  private router = inject(Router);

  activeTab = signal<'users' | 'tickets'>('users');
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

  async deleteProducts(todoId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await this.catalogService.deleteProduct(todoId);
        await this.loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }
}
