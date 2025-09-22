import { effect, Injectable, signal, computed } from '@angular/core';
import { PRODUCTS } from '../../../../assets/data/products.mock';
import { CreateProductRequest, Product, UpdateProductRequest } from '../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  //State privé
  private readonly _products = signal<Product[]>(PRODUCTS);
  //State public
  readonly products = this._products.asReadonly();

  //Computed
  readonly totalProducts = computed(() => this._products().length);
  readonly priceRange = computed(() => {
    const prices = this._products().map((p) => p.price);
    return prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : { min: 0, max: 0 };
  });

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('products') : null;
    if (saved) {
      this._products.set(JSON.parse(saved));
    }
    effect(() => {
      localStorage.setItem('products', JSON.stringify(this._products()));
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllProducts() {
    await this.delay(300);
    return this._products();
  }

  async getProductById(id: number) {
    await this.delay(200);
    const product = this.products().find((product) => product.id === id);
    return product;
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    await this.delay(400);
    const newProduct: Product = {
      id: Date.now(),
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      sizes: productData.sizes,
      colors: productData.colors,
      image1: productData.image1,
      image2: productData.image2,
      description: productData.description,
    };
    this._products.update((products) => [...products, newProduct]);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<UpdateProductRequest>): Promise<Product | null> {
    await this.delay(300);

    let updatedProduct: Product | undefined;
    this._products.update((products) =>
      products.map((product) => {
        if (product.id === id) {
          updatedProduct = { ...product, ...updates };
          return updatedProduct;
        }
        return product;
      }),
    );

    return updatedProduct || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.delay(250);

    let deleted = false;
    this._products.update((products) => {
      const initialLength = products.length;
      const updatedProducts = products.filter((product) => product.id !== id);
      deleted = updatedProducts.length < initialLength;
      return updatedProducts;
    });

    return deleted;
  }
}
