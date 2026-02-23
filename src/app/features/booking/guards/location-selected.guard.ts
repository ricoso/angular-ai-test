import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const locationSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug('[Guard] locationSelectedGuard — brand:', store.selectedBrand(), 'hasBrand:', store.hasBrandSelected(), 'hasLocation:', store.hasLocationSelected());

  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }

  if (store.hasLocationSelected()) {
    return true;
  }

  return router.createUrlTree(['/home/location']);
};
