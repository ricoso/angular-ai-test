import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const servicesSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug(
    '[Guard] servicesSelectedGuard — hasLocation:',
    store.hasLocationSelected(),
    'hasBrand:',
    store.hasBrandSelected(),
    'hasServices:',
    store.hasServicesSelected()
  );

  if (!store.hasLocationSelected()) {
    return router.createUrlTree(['/home/location']);
  }

  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }

  if (store.hasServicesSelected()) {
    return true;
  }

  return router.createUrlTree(['/home/services']);
};
