export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  sizes: number[];
  colors: string[];
  image1: string;
  image2?: string;
  description: string;
}

export type CreateProductRequest = Omit<Product, 'id'>;

export type UpdateProductRequest = Partial<Omit<Product, 'id'>>;
