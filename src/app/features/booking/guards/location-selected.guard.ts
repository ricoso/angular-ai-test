import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const locationSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug('[Guard] locationSelectedGuard — hasLocation:', store.hasLocationSelected());

  if (store.hasLocationSelected()) {
    return true;
  }

  return router.createUrlTree(['/home/location']);
};
