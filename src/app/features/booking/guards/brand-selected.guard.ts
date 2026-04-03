import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const brandSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug('[Guard] brandSelectedGuard — hasLocation:', store.hasLocationSelected(), 'hasBrand:', store.hasBrandSelected());

  if (!store.hasLocationSelected()) {
    return router.createUrlTree(['/home/location']);
  }

  if (store.hasBrandSelected()) {
    return true;
  }

  return router.createUrlTree(['/home/brand']);
};
