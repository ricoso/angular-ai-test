import type { Routes } from '@angular/router';

import { markenResolver } from './resolvers/marken.resolver';

export const buchungRoutes: Routes = [
  {
    path: '',
    redirectTo: 'marke',
    pathMatch: 'full'
  },
  {
    path: 'marke',
    loadComponent: () => import('./components/markenauswahl/markenauswahl-container.component')
      .then(m => m.MarkenauswahlContainerComponent),
    resolve: { _: markenResolver }
  }
];
