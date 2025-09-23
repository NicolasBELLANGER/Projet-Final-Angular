import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../services/catalog.service';
import { Product } from '../models/catalog.model';
import { ColorsPipe } from '../../../shared/pipes/colors.pipe';
import { LowPriceDirective } from '../../../shared/directives/lowPrice.directive';
import { ColorHexPipe } from '../../../shared/pipes/color-hex.pipe';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, ColorsPipe, LowPriceDirective, ColorHexPipe],
  template: `
    <section class="px-6 md:px-8 lg:px-12 py-10">
      <p
        class="text-center max-w-3xl mx-auto text-neutral-700 text-sm md:text-base leading-relaxed mb-8"
      >
        SneakPeak, votre destination sneakers multi-marques. Des icônes intemporelles aux drops du
        moment, découvrez une sélection pointue mêlant style, confort et performance. Nike, adidas,
        New Balance, Jordan, ASICS… et bien plus — trouvez la paire qui vous ressemble.
      </p>
      <div class="mx-auto max-w-6xl mb-8 grid gap-6">
        <fieldset>
          <legend class="text-sm font-medium">Prix</legend>
          <div class="mt-3 flex items-center gap-3">
            <label class="text-xs text-neutral-600" for="minNumber">Min</label>
            <input
              id="minNumber"
              type="number"
              inputmode="decimal"
              class="w-28 border px-2 py-1 text-sm"
              [min]="priceRange().min"
              [max]="maxPrice()"
              step="0.01"
              [value]="minPrice()"
              (input)="onMinPriceInput(+$any($event.target).value)"
            />
            <label class="text-xs text-neutral-600" for="maxNumber">Max</label>
            <input
              id="maxNumber"
              type="number"
              inputmode="decimal"
              class="w-28 border px-2 py-1 text-sm"
              [min]="minPrice()"
              [max]="priceRange().max"
              step="0.01"
              [value]="maxPrice()"
              (input)="onMaxPriceInput(+$any($event.target).value)"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm font-medium mb-2">Marques</legend>
          <div class="flex flex-wrap gap-3">
            @for (b of brands(); track b; let i = $index) {
              <div class="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  class="size-4"
                  [id]="'brand-' + i"
                  [checked]="selectedBrands().includes(b)"
                  (change)="toggleBrand(b)"
                />
                <label class="cursor-pointer text-sm" [attr.for]="'brand-' + i">
                  {{ b }}
                </label>
              </div>
            } @empty {
              <span class="text-sm text-neutral-500">Aucune marque disponible</span>
            }
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm font-medium mb-2">Couleurs</legend>
          <div class="flex flex-wrap gap-3">
            @for (c of colors(); track c; let i = $index) {
              <input
                type="checkbox"
                class="size-4"
                [id]="'color-' + i"
                [checked]="selectedColors().includes(c)"
                (change)="toggleColor(c)"
              />
              <label
                class="inline-flex items-center gap-2 cursor-pointer"
                [attr.for]="'color-' + i"
              >
                <span class="text-sm">{{ c | colors }}</span>
              </label>
            } @empty {
              <span class="text-sm text-neutral-500">Aucune couleurs disponibles</span>
            }
          </div>
        </fieldset>
      </div>
      <p class="text-center text-sm text-neutral-600 mb-6">
        {{ visibleProducts().length }} / {{ totalProducts() }} produits affichés
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
        @for (p of visibleProducts(); track p) {
          <a
            [routerLink]="['/product', p.id]"
            class="group block focus:outline-none focus:ring-2 focus:ring-black"
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
            <div class="mt-1 flex flex-wrap gap-1 items-center min-h-5">
              @for (c of p.colors; track c) {
                <span
                  class="inline-block size-4 rounded-full border"
                  [style.backgroundColor]="c | colorHex"
                  [attr.title]="c"
                ></span>
              }
            </div>
            <div class="text-lg font-bold" [appLowPrice]="p.price">
              {{ p.price | currency: 'EUR' }}
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class CatalogComponent {
  private catalogService = inject(CatalogService);
  products = this.catalogService.products;
  totalProducts = this.catalogService.totalProducts;
  priceRange = this.catalogService.priceRange;

  minPrice = signal(0);
  maxPrice = signal(0);
  selectedBrands = signal<string[]>([]);
  selectedColors = signal<string[]>([]);

  constructor() {
    const range = this.priceRange();
    this.minPrice.set(range.min);
    this.maxPrice.set(range.max);
  }

  brands = computed(() => {
    const set = new Set(
      this.products()
        .map((p) => p.brand)
        .filter(Boolean),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  colors = computed(() => {
    const set = new Set(
      this.products()
        .flatMap((p) => p.colors ?? [])
        .filter(Boolean),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  onMinPriceInput(val: number) {
    const range = this.priceRange();
    const clamped = Math.min(Math.max(val, range.min), this.maxPrice());
    this.minPrice.set(clamped);
  }
  onMaxPriceInput(val: number) {
    const range = this.priceRange();
    const clamped = Math.max(Math.min(val, range.max), this.minPrice());
    this.maxPrice.set(clamped);
  }

  toggleBrand(brand: string) {
    const current = this.selectedBrands();
    if (current.includes(brand)) {
      this.selectedBrands.set(current.filter((b) => b !== brand));
    } else {
      this.selectedBrands.set([...current, brand]);
    }
  }
  toggleColor(color: string) {
    const current = this.selectedColors();
    if (current.includes(color)) {
      this.selectedColors.set(current.filter((c) => c !== color));
    } else {
      this.selectedColors.set([...current, color]);
    }
  }

  visibleProducts = computed<Product[]>(() => {
    const list = this.products();
    const min = this.minPrice();
    const max = this.maxPrice();
    const brands = this.selectedBrands();
    const colors = this.selectedColors();

    return list.filter((p) => {
      const okPrice = p.price >= min && p.price <= max;
      const okBrand = brands.length === 0 || brands.includes(p.brand);
      const okColor = colors.length === 0 || (p.colors ?? []).some((c) => colors.includes(c));
      return okPrice && okBrand && okColor;
    });
  });
}
