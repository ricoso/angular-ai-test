import { Routes } from '@angular/router';

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
    path: '**',
    redirectTo: 'home'
  }
];
