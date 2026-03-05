import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const carInformationGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug(
    '[Guard] carInformationGuard — brand:',
    store.selectedBrand(),
    'hasLocation:',
    store.hasLocationSelected(),
    'hasServices:',
    store.hasServicesSelected(),
    'hasAppointment:',
    store.hasAppointmentSelected()
  );

  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }

  if (!store.hasLocationSelected()) {
    return router.createUrlTree(['/home/location']);
  }

  if (!store.hasServicesSelected()) {
    return router.createUrlTree(['/home/services']);
  }

  if (!store.hasAppointmentSelected()) {
    return router.createUrlTree(['/home/appointment']);
  }

  return true;
};
