import { Injectable, signal } from '@angular/core';
import { PRODUCTS } from '../../../../assets/data/products.mock';
import { CreateProductRequest, Product, UpdateProductRequest } from '../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  public products = signal<Product[]>(PRODUCTS);

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('products') : null;
    if (saved) {
      this.products.set(JSON.parse(saved));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //GETALL Récuperer tous les produits
  async getAllProducts() {
    console.log('🔄 Service: Récupération de tous les todos...');
    await this.delay(300);
    console.log('✅ Service: Todos récupérés avec succès');
    return this.products;
  }

  //GETPRODUCTBYID Récuperer un produit par son ID
  async getProductById(id: number) {
    console.log(`🔄 Service: Récupération du todo ${id}...`);
    await this.delay(200);
    const product = this.products().find((product) => product.id === id);
    console.log(`✅ Service: Todo ${id} récupéré:`, product);
    return product;
  }

  //CREATEPRODUCT Créer un nouveau produit
  async createProduct(productData : CreateProductRequest): Promise<Product>{
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
    this.products.update((products) => [...products, newProduct]);
    localStorage.setItem('products', JSON.stringify(this.products()));

    console.log('✅ Service: Todo créé avec succès:', newProduct);
    return newProduct;
  }

  //UPDATEPRODUCT Mettre à jour un produit existant
  async updateProduct(id: number, updates: Partial<UpdateProductRequest>): Promise<Product | null> {
    console.log(`🔄 Service: Mise à jour du product ${id}...`, updates);
    await this.delay(300);

    let updatedProduct: Product | undefined;
    this.products.update((products) =>
      products.map((product) => {
        if (product.id === id) {
          updatedProduct = { ...product, ...updates };
          return updatedProduct;
        }
        return product;
      })
    );

    localStorage.setItem('products', JSON.stringify(this.products()));
    console.log(`✅ Service: Todo ${id} mis à jour avec succès:`, updatedProduct);
    return updatedProduct || null;
  }

  //DELETEPRODUCT Supprimer un produit par son ID
  async deleteProduct(id: number): Promise<boolean> {
    console.log(`🔄 Service: Suppression du product ${id}...`);
    await this.delay(250);

    let deleted = false;
    this.products.update((products) => {
      const initialLength = products.length;
      const updatedProducts = products.filter((product) => product.id !== id);
      deleted = updatedProducts.length < initialLength;
      return updatedProducts;
    });

    localStorage.setItem('products', JSON.stringify(this.products()));
    console.log(`✅ Service: Todo ${id} ${deleted ? 'supprimé' : 'non trouvé'}.`);
    return deleted;
  }
}
