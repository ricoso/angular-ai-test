import type { Routes } from '@angular/router';

import { brandSelectedGuard } from './guards/brand-selected.guard';
import { locationSelectedGuard } from './guards/location-selected.guard';
import { brandsResolver } from './resolvers/brands.resolver';
import { locationsResolver } from './resolvers/locations.resolver';
import { servicesResolver } from './resolvers/services.resolver';

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
  },
  {
    path: 'location',
    loadComponent: () => import('./components/location-selection/location-selection-container.component')
      .then(m => m.LocationSelectionContainerComponent),
    canActivate: [brandSelectedGuard],
    resolve: { _: locationsResolver }
  },
  {
    path: 'services',
    loadComponent: () => import('./components/service-selection/service-selection-container.component')
      .then(m => m.ServiceSelectionContainerComponent),
    canActivate: [locationSelectedGuard],
    resolve: { _: servicesResolver }
  }
];
