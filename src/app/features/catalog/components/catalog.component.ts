import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../services/catalog.service';
import { Product } from '../models/catalog.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10">
      <p
        class="text-center max-w-3xl mx-auto text-neutral-700 text-sm md:text-base leading-relaxed mb-8"
      >
        SneakPeak, votre destination sneakers multi-marques. Des icônes intemporelles aux drops du
        moment, découvrez une sélection pointue mêlant style, confort et performance. Nike, adidas,
        New Balance, Jordan, ASICS… et bien plus — trouvez la paire qui vous ressemble.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a
          *ngFor="let p of products(); trackBy: trackById"
          [routerLink]="['/product', p.id]"
          class="group block"
        >
          <div class="bg-neutral-100 aspect-[4/3] overflow-hidden">
            <img
              [src]="p.image1"
              [alt]="p.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <h2
            class="mt-3 text-base font-semibold tracking-tight group-hover:underline underline-offset-4"
          >
            {{ p.name }}
          </h2>
          <div class="text-lg font-bold">{{ p.price | currency: 'EUR' }}</div>
        </a>
      </div>
    </section>
  `,
})
export class CatalogComponent {
  private catalog = inject(CatalogService);
  products = this.catalog.products;

  trackById = (_: number, p: Product) => p.id;
}
