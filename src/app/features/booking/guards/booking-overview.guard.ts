import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const bookingOverviewGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug(
    '[Guard] bookingOverviewGuard — brand:',
    store.selectedBrand(),
    'location:',
    store.selectedLocation(),
    'services:',
    store.selectedServices().length,
    'appointment:',
    store.selectedAppointment(),
    'customerInfo:',
    !!store.customerInfo(),
    'vehicleInfo:',
    !!store.vehicleInfo(),
    'privacyConsent:',
    store.privacyConsent()
  );

  if (!store.isBookingComplete()) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
