import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white border-b px-4 sm:px-6">
      <div class="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/catalog" class="text-2xl sm:text-3xl font-bold tracking-tight text-black">
          SneakPeak
        </a>

        <!-- Right -->
        <div class="flex items-center gap-4">
          <!-- Panier -->
          <button
            class="relative p-2 rounded-full hover:bg-gray-100"
            aria-label="Panier"
            (click)="goCart()"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-width="2" d="M6 6h14l-1.5 9H8L6 6Z"></path>
              <circle cx="9" cy="20" r="1.5"></circle>
              <circle cx="18" cy="20" r="1.5"></circle>
            </svg>
            <span
              *ngIf="cartCount() > 0"
              class="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full"
            >
              {{ cartCount() }}
            </span>
          </button>

          <!-- Compte / Admin -->
          <ng-container *ngIf="currentUser() as user; else guest">
            <a
              *ngIf="user.role === 'admin'"
              routerLink="/admin"
              class="text-sm font-semibold hover:opacity-70"
            >
              Admin
            </a>
            <button class="text-sm font-semibold hover:opacity-70" (click)="logout()">
              Déconnexion
            </button>
          </ng-container>
          <ng-template #guest>
            <a routerLink="/auth/login" class="text-sm font-semibold hover:opacity-70"
              >Se connecter</a
            >
            <a routerLink="/auth/register" class="text-sm font-semibold hover:opacity-70"
              >S'inscrire</a
            >
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  currentUser = this.auth.currentUser$;

  goCart() {
    this.router.navigate(['/cart']);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  cartCount() {
    return 0;
  }
}
