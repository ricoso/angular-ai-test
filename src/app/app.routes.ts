import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/booking/booking.routes')
      .then(m => m.bookingRoutes)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
