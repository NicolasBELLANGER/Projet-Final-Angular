import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/cart.component').then((m) => m.CartComponent),
  },
];
