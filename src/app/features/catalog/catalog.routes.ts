import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/catalog.component').then((m) => m.CatalogComponent),
  },
];
