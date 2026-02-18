import { computed, inject } from '@angular/core';

import { signalStore, withComputed, withState } from '@ngrx/signals';

import { BookingStore } from '@app/features/booking/stores/booking.store';

import type { CartState } from '../models/cart.model';
import { CART_DEFAULTS, MAX_BADGE_COUNT } from '../models/cart.model';

/**
 * Global store for cart
 * Derives item count from BookingStore.selectedServices
 */
export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>(CART_DEFAULTS),

  withComputed((_store, bookingStore = inject(BookingStore)) => ({
    itemCount: computed(() => bookingStore.selectedServiceCount()),

    badgeText: computed(() => {
      const count = bookingStore.selectedServiceCount();
      if (count === 0) return '';
      if (count > MAX_BADGE_COUNT) return `${MAX_BADGE_COUNT}+`;
      return `${count}`;
    }),

    hasItems: computed(() => bookingStore.selectedServiceCount() > 0)
  }))
);
