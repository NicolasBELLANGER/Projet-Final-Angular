import { Injectable } from '@angular/core';
import { PRODUCTS } from '../../../../assets/data/products.mock';
import { CreateProductRequest, Product } from '../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private products = PRODUCTS;

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('products') : null;
    if (saved) {
      this.products = JSON.parse(saved);
    }
  }
  //GETALL Récuperer tous les produits
  async getAllProducts() {
    console.log('🔄 Service: Récupération de tous les todos...');
    console.log('✅ Service: Todos récupérés avec succès');
    return this.products;
  }
  //GETPRODUCTBYID Récuperer un produit par son ID
  async getProductById(id: number) {
    console.log(`🔄 Service: Récupération du todo ${id}...`);

    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    console.log(`✅ Service: Todo ${id} récupéré:`, product);
    return product;
  }
  //CREATEPRODUCT Créer un nouveau produit
  async createProduct(productData : CreateProductRequest): Promise<Product>{
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
    this.products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(this.products));
    return newProduct;
  }
}
