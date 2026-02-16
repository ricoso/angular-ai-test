import type { Routes } from '@angular/router';
import { brandsResolver } from './resolvers/brands.resolver';

export const bookingRoutes: Routes = [
  {
    path: '',
    redirectTo: 'brand',
    pathMatch: 'full'
  },
  {
    path: 'brand',
    loadComponent: () => import('./components/brand-selection/brand-selection-container.component')
      .then(m => m.BrandSelectionContainerComponent),
    resolve: { _: brandsResolver }
  }
];
