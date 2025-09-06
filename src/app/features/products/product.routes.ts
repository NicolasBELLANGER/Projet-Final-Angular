import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./components/product.component').then((m) => m.ProductComponent),
  },
];
