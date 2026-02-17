import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const locationsResolver: ResolveFn<void> = () => {
  const store = inject(BookingStore);
  store.loadLocations();
  return;
};
