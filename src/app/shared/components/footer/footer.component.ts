// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="border-t border-neutral-200 mt-16 bg-white">
      <div class="px-6 md:px-8 lg:px-12 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="font-extrabold tracking-tight text-lg">SneakPeak</a>
            <p class="mt-3 text-neutral-600">
              Votre destination sneakers multi-marques : style, confort et performance.
            </p>
          </div>
          <nav aria-label="Boutique" class="space-y-2">
            <h3 class="font-semibold">Boutique</h3>
            <a routerLink="/catalog" class="block hover:underline underline-offset-4">Catalogue</a>
            <a routerLink="/cart" class="block hover:underline underline-offset-4">Panier</a>
            <a routerLink="/orders" class="block hover:underline underline-offset-4">Mes commandes</a>
          </nav>
          <nav aria-label="Aide" class="space-y-2">
            <h3 class="font-semibold">Aide</h3>
            <a routerLink="/auth" class="block hover:underline underline-offset-4">Connexion</a>
          </nav>
        </div>
        <div class="mt-10 pt-6 border-t border-neutral-200 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-neutral-500">
          <p>© {{ year }} SneakPeak. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
