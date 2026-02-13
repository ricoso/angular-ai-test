import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/containers/home-container/home-container.component')
      .then(m => m.HomeContainerComponent)
  },
  {
    path: 'buchung',
    loadChildren: () => import('./features/buchung/buchung.routes')
      .then(m => m.buchungRoutes)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
